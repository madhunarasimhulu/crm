import { TenantConfig, AdminGroups } from './TenantConfig';

export const modules = {
  SPEND_LIMIT_MODIFIY: {
    name: 'Spending Limit Modification',
    roles: [...AdminGroups],
  },
  FRM_BLOCK: {
    name: 'FRM Block',
    roles: [
      ...AdminGroups,
      TenantConfig['CL_000CUB|FRM'].role,
      TenantConfig['CL_00UTKB|FRM'].role,
      TenantConfig['CL_00UTKB|USFB_ADMIN'].role,
    ],
  },
  TEMP_CARD_BLOCK: {
    name: 'Temporary Card Block',
    roles: [
      ...AdminGroups,
      TenantConfig['CL_000CUB|CUST_SERVICE'].role,
      TenantConfig['CL_00UTKB|CUST_SERVICE'].role,
      TenantConfig['CL_00UTKB|USFB_ADMIN'].role,
    ],
  },
  DEFINITIVE_CARD_BLOCK: {
    name: 'Definitive Card Block',
    roles: [...AdminGroups, TenantConfig['CL_00UTKB|USFB_ADMIN'].role],
  },
  SWITCH_OTH_TENANTS: {
    name: 'Switch over to different banks',
    roles: [...AdminGroups, TenantConfig['Operations'].role],
  },
};
