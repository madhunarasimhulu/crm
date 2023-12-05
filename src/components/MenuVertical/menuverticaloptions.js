import { isCreditProgramType } from '../../utils';

const menuOptions = (customerID, accountId, customerProgramType, isMobile) => {
  const clientId = sessionStorage.getItem('clientId');
  const arrayOptions = [
    {
      name: 'mobileSummary',
      label: 'mobileSummary',
      to: `/customers/${customerID}/accounts/${accountId}/summary`,
      roles: ['ALL'],
      attendantOnly: false,
    },

    {
      name: 'timeline',
      label: 'Timeline',
      to: `/customers/${customerID}/accounts/${accountId}/timeline`,
      roles: ['ALL'],
      attendantOnly: false,
    },
    {
      name: 'profileParams',
      label: 'Limits',
      to: `/customers/${customerID}/accounts/${accountId}/profile/spending-limits`,
      roles: ['ALL'],
      attendantOnly: false,
    },
    {
      name: 'activity',
      label: 'activity',
      to: `/customers/${customerID}/accounts/${accountId}/activity`,
      roles: ['ALL'],
      attendantOnly: true,
    },
    {
      name: 'notes',
      label: 'notes',
      onClickHandlerName: `toggleAttendanceNotes`,
      roles: ['ALL'],
      attendantOnly: true,
    },
    {
      name: 'serviceRequests',
      label: 'Service Requests',
      to: `/customers/${customerID}/accounts/${accountId}/serviceRequests`,
      roles: ['ALL'],
      attendantOnly: false,
    },
  ];

  const creditOption = {
    name: 'statements',
    label: 'statements',
    to: `/customers/${customerID}/accounts/${accountId}`,
    roles: ['ALL'],
    attendantOnly: false,
  };

  const debitOption = {
    name: 'debit',
    label: 'extract',
    to: `/customers/${customerID}/accounts/${accountId}/debit`,
    roles: ['ALL'],
    attendantOnly: false,
  };

  const cardsOption = {
    name: 'cards',
    label: 'cards',
    to: `/customers/${customerID}/accounts/${accountId}/profile/cards`,
    roles: ['ALL'],
    attendantOnly: false,
  };

  const supportOption = {
    name: 'support',
    label: 'Support',
    to: `/customers/${customerID}/accounts/${accountId}/support`,
    roles: ['ALL'],
    attendantOnly: false,
  };

  if (isCreditProgramType(customerProgramType)) {
    if (isMobile && clientId === 'CL_00UTKB') {
      arrayOptions.splice(4, 0, supportOption);
    }
    arrayOptions.splice(1, 0, creditOption);
    arrayOptions.splice(3, 0, cardsOption);
  } else {
    if (isMobile && clientId === 'CL_00UTKB') {
      arrayOptions.splice(4, 0, supportOption);
    }
    arrayOptions.splice(1, 0, debitOption);
    arrayOptions.splice(3, 0, cardsOption);
  }

  return [...arrayOptions];
};

export default menuOptions;
