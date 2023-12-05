import { config } from 'dotenv';
config();

export const TenantConfig = {
  '42CSAdmins': {
    name: '42CS Admin',
    tenantId: '',
    role: '42CSAdmins',
  },
  '42csTrustedPeople': {
    name: '42csTrustedPeople',
    tenantId: '',
    role: '42csTrustedPeople',
  },
  CL_000CUB: {
    name: 'City Union Bank',
    tenantId: process.env.REACT_APP_TN_CUB,
    role: 'CL_000CUB',
  },
  CL_00UTKB: {
    name: 'Utkarsh Small Finance Bank',
    tenantId: process.env.REACT_APP_TN_USFB,
    role: 'CL_00UTKB',
  },
  Operations: {
    name: 'Operations',
    tenantId: '',
    role: 'Operations',
  },
  'CL_000CUB|FRM': {
    name: 'CUB FRM',
    tenantId: '',
    role: 'CL_000CUB|FRM',
  },
  'CL_00UTKB|FRM': {
    name: 'USFB FRM',
    tenantId: '',
    role: 'CL_00UTKB|FRM',
  },
  'CL_000CUB|CUST_SERVICE': {
    name: 'CUB Customer Serivice',
    tenantId: '',
    role: 'CL_000CUB|CUST_SERVICE',
  },
  'CL_00UTKB|CUST_SERVICE': {
    name: 'USFB Customer Serivice',
    tenantId: '',
    role: 'CL_00UTKB|CUST_SERVICE',
  },
  'CL_00UTKB|USFB_ADMIN': {
    name: 'USFB Admin',
    tenantId: '',
    role: 'CL_00UTKB|USFB_ADMIN',
  },
};

export const AdminGroups = ['42CSAdmins', '42csTrustedPeople'];

export const TenantSwitchOverGroups = ['Operations'];

export const timerNotAllowedHosts = [
  process.env.REACT_APP_CAROLINE_HOST,
  'localhost',
];
