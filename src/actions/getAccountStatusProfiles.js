import { Customers } from '../clients';
import { setAccountStatusProfiles } from '.';

const getAccountStatusProfiles =
  (accountId, credentials, program) => async (dispatch) => {
    if (program !== undefined) return;
    try {
      const res = await Customers.getAccountStatus(accountId, credentials);
      if (res.error) return;
      dispatch(setAccountStatusProfiles(res.data.status));
    } catch (err) {
      return err;
    }
  };

export default getAccountStatusProfiles;
