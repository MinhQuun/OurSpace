-- Local HS256 Auth profile. No verifier key is shipped in source or exposed to
-- the runtime role. Production asymmetric signing/rotation remains a gate.
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA app_internal;
CREATE TABLE app_internal.auth_verifier (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  issuer text NOT NULL,
  signing_key text NOT NULL CHECK (length(signing_key) >= 40)
);
ALTER TABLE app_internal.auth_verifier ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_internal.auth_verifier FORCE ROW LEVEL SECURITY;
REVOKE ALL ON app_internal.auth_verifier FROM PUBLIC;

CREATE FUNCTION app_internal.provider_claims(p_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $verify$
DECLARE parts text[]; header jsonb; claims jsonb; expected text;
  verifier app_internal.auth_verifier%ROWTYPE;
  now_epoch numeric := extract(epoch FROM clock_timestamp());
BEGIN
  IF p_token IS NULL OR length(p_token) > 16384
    OR p_token !~ '^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$' THEN
    RAISE EXCEPTION 'Authentication denied';
  END IF;
  parts := string_to_array(p_token, '.');
  header := convert_from(decode(translate(parts[1], '-_', '+/') || repeat('=', (4-length(parts[1])%4)%4), 'base64'), 'UTF8')::jsonb;
  IF header->>'alg' IS DISTINCT FROM 'HS256' OR header ? 'crit' THEN
    RAISE EXCEPTION 'Authentication denied';
  END IF;
  SELECT * INTO STRICT verifier FROM app_internal.auth_verifier WHERE singleton;
  expected := rtrim(translate(encode(app_internal.hmac(parts[1] || '.' || parts[2], verifier.signing_key, 'sha256'), 'base64'), '+/', '-_'), '=');
  IF expected IS DISTINCT FROM parts[3] THEN RAISE EXCEPTION 'Authentication denied'; END IF;
  claims := convert_from(decode(translate(parts[2], '-_', '+/') || repeat('=', (4-length(parts[2])%4)%4), 'base64'), 'UTF8')::jsonb;
  IF claims->>'iss' IS DISTINCT FROM verifier.issuer
    OR claims->>'aud' IS DISTINCT FROM 'authenticated'
    OR claims->>'role' IS DISTINCT FROM 'authenticated'
    OR claims->>'is_anonymous' IS DISTINCT FROM 'false'
    OR jsonb_typeof(claims->'exp') IS DISTINCT FROM 'number'
    OR jsonb_typeof(claims->'iat') IS DISTINCT FROM 'number'
    OR (claims->>'exp')::numeric <= now_epoch
    OR (claims->>'iat')::numeric > now_epoch
    OR ((claims ? 'nbf') AND (claims->>'nbf')::numeric > now_epoch)
    OR nullif(claims->>'email', '') IS NULL
    OR (claims->>'sub') IS NULL THEN RAISE EXCEPTION 'Authentication denied'; END IF;
  PERFORM (claims->>'sub')::uuid;
  RETURN claims;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
END;
$verify$;
REVOKE ALL ON FUNCTION app_internal.provider_claims(text) FROM PUBLIC;

-- Identity and maximum expiry derive from a verified provider signature, never
-- from a caller-supplied account ID. Auth transport also checks current identity.
CREATE FUNCTION app_internal.issue_verified_session(
  p_provider_token text, p_display_name text, p_session_id uuid,
  p_token_hash text
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE account_state text; claims jsonb; p_account_id uuid; p_expires_at timestamptz;
BEGIN
  claims := app_internal.provider_claims(p_provider_token);
  p_account_id := (claims->>'sub')::uuid;
  p_expires_at := to_timestamp((claims->>'exp')::double precision);
  IF p_expires_at IS NULL OR p_expires_at <= clock_timestamp() THEN
    RAISE EXCEPTION 'Session issuance denied';
  END IF;
  INSERT INTO m10.accounts(id, state) VALUES (p_account_id, 'active')
    ON CONFLICT (id) DO NOTHING;
  SELECT state INTO account_state FROM m10.accounts
    WHERE id = p_account_id FOR UPDATE;
  IF account_state = 'pending_verification' THEN
    UPDATE m10.accounts SET state = 'active' WHERE id = p_account_id;
  ELSIF account_state IS DISTINCT FROM 'active' THEN
    RAISE EXCEPTION 'Session issuance denied';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM m10.profiles WHERE user_id = p_account_id) THEN
    INSERT INTO m10.profiles(user_id, display_name)
      VALUES (p_account_id, btrim(p_display_name));
  END IF;
  INSERT INTO m10.sessions(id, account_id, token_hash, expires_at)
    VALUES (p_session_id, p_account_id, p_token_hash, p_expires_at);
  RETURN p_session_id;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.issue_verified_session(text,text,uuid,text) FROM PUBLIC;
