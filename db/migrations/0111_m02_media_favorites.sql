CREATE TABLE m02.media_favorites (
 account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
 media_id uuid NOT NULL REFERENCES m02.media(id) ON DELETE RESTRICT,
 favorited boolean NOT NULL,
 version bigint NOT NULL DEFAULT 1 CHECK(version>0),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(account_id,media_id)
);
ALTER TABLE m02.media_favorites ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON m02.media_favorites FROM PUBLIC;
-- No target-account parameter: a reader can inspect only their own preference.
-- Keep false rows to preserve version history across unfavorite/refavorite.
CREATE FUNCTION app_internal.read_media_favorite(p_session_hash text,p_media uuid)
RETURNS TABLE(favorited boolean,version bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT coalesce(f.favorited,false),coalesce(f.version,0::bigint)
 FROM m02.media m LEFT JOIN m02.media_favorites f
 ON f.media_id=m.id AND f.account_id=app_internal.session_actor(p_session_hash)
 WHERE m.id=p_media AND app_internal.can_read_resource(p_session_hash,m.id);
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_media_favorite(text,uuid) FROM PUBLIC;
