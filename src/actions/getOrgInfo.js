import { setOrg } from '.';

export default function getOrgInfo() {
  return async (dispatch) => {
    const org = {
      allowAccountStatusChange:
        process?.env.REACT_APP_ALLOW_ACCOUNT_STATUS_CHANGE === 'true',
      currency: process?.env.REACT_APP_CURRENCY,
      currencySymbol: process?.env.REACT_APP_CURRENCY_SYMBOL || '',
      username: process?.env.REACT_APP_USERNAME || '',
      separatorDecimals: process?.env.REACT_APP_SEPARATOR_DECIMALS || '.',
      separatorThousands: process?.env.REACT_APP_SEPARATOR_THOUSANDS || ',',
    };
    dispatch(setOrg(org));
    return org;
  };
}
