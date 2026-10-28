ALTER TABLE app_internal.pairing_request_policies DROP CONSTRAINT pairing_request_policies_action_check;
ALTER TABLE app_internal.pairing_request_policies ADD CONSTRAINT pairing_request_policies_action_check
CHECK(action IN ('list','create','inspect','accept','reject','revoke','confirm','spaces_list','disconnect','permission_inspect','permission_list','permission_grant','permission_revoke','binary_download'));
