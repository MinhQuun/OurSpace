-- 0056 grants an explicit runtime function. Bootstrap the role on fresh clusters;
-- no password, schema/table access or membership is granted here.
DO $role$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='ourspace_runtime') THEN
    CREATE ROLE ourspace_runtime LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
  END IF;
END $role$;
