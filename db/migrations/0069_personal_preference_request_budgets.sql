ALTER TABLE app_internal.pairing_request_policies DROP CONSTRAINT pairing_request_policies_action_check;
ALTER TABLE app_internal.pairing_request_policies ADD CONSTRAINT pairing_request_policies_action_check
CHECK(action IN ('list','create','inspect','accept','reject','revoke','confirm','spaces_list','disconnect','permission_inspect','permission_list','permission_grant','permission_revoke','binary_download','profile_read','profile_update','profile_partner','profile_grants','profile_share','profile_revoke','profile_couple','profile_couple_history','profile_couple_update','profile_preferences','profile_preferences_update'));

