-- Infrastructure only: deployment policy must be explicitly configured and reviewed.
CREATE TABLE app_internal.pairing_request_policies (
  action text PRIMARY KEY CHECK (action IN ('list','create','inspect','accept','reject','revoke','confirm')),
  max_requests integer NOT NULL CHECK (max_requests BETWEEN 1 AND 10000),
  window_seconds integer NOT NULL CHECK (window_seconds BETWEEN 1 AND 86400)
);
CREATE TABLE app_internal.pairing_request_budgets (
  account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  action text NOT NULL REFERENCES app_internal.pairing_request_policies(action) ON DELETE RESTRICT,
  window_started_at timestamptz NOT NULL,
  requests integer NOT NULL CHECK (requests >= 1),
  PRIMARY KEY(account_id,action)
);
ALTER TABLE app_internal.pairing_request_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_internal.pairing_request_policies FORCE ROW LEVEL SECURITY;
ALTER TABLE app_internal.pairing_request_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_internal.pairing_request_budgets FORCE ROW LEVEL SECURITY;
REVOKE ALL ON app_internal.pairing_request_policies,app_internal.pairing_request_budgets FROM PUBLIC;

-- Call and COMMIT before the protected operation: denied commands must still cost budget.
-- No arbitrary caller account, IP, capability, or session identifier is stored here.
CREATE FUNCTION app_internal.consume_pairing_request(p_session_hash text,p_action text)
RETURNS TABLE(allowed boolean,retry_after integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
DECLARE
  v_actor uuid;
  v_policy app_internal.pairing_request_policies%ROWTYPE;
  v_budget app_internal.pairing_request_budgets%ROWTYPE;
  v_now timestamptz;
BEGIN
  v_actor := app_internal.session_actor(p_session_hash);
  IF v_actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  SELECT * INTO v_policy FROM app_internal.pairing_request_policies WHERE action=p_action;
  IF NOT FOUND THEN RAISE EXCEPTION 'policy unavailable' USING ERRCODE='55000'; END IF;
  INSERT INTO app_internal.pairing_request_budgets(account_id,action,window_started_at,requests)
    VALUES(v_actor,p_action,clock_timestamp(),1) ON CONFLICT DO NOTHING;
  IF FOUND THEN RETURN QUERY SELECT true,0; RETURN; END IF;
  SELECT * INTO v_budget FROM app_internal.pairing_request_budgets
    WHERE account_id=v_actor AND action=p_action FOR UPDATE;
  v_now := clock_timestamp();
  IF v_budget.window_started_at + make_interval(secs=>v_policy.window_seconds) <= v_now THEN
    UPDATE app_internal.pairing_request_budgets SET window_started_at=v_now,requests=1
      WHERE account_id=v_actor AND action=p_action;
    RETURN QUERY SELECT true,0;
  ELSIF v_budget.requests < v_policy.max_requests THEN
    UPDATE app_internal.pairing_request_budgets SET requests=requests+1
      WHERE account_id=v_actor AND action=p_action;
    RETURN QUERY SELECT true,0;
  ELSE
    RETURN QUERY SELECT false,greatest(1,ceil(extract(epoch FROM
      v_budget.window_started_at + make_interval(secs=>v_policy.window_seconds) - v_now))::integer);
  END IF;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.consume_pairing_request(text,text) FROM PUBLIC;
