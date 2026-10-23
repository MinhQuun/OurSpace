-- Synthetic local fixtures, deliberately not authenticated or email-verified.
BEGIN;
INSERT INTO m10.accounts(id) VALUES
  ('10000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000002')
ON CONFLICT (id) DO NOTHING;
INSERT INTO m10.profiles(user_id, display_name) VALUES
  ('10000000-0000-4000-8000-000000000001', 'Test Account A'),
  ('10000000-0000-4000-8000-000000000002', 'Test Account B')
ON CONFLICT (user_id) DO NOTHING;
COMMIT;
