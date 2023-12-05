import { Accounts } from '../clients';
import { setAccountDetails } from '.';

const getAccountDetails =
  (accountId, credentials = {}) =>
  async (dispatch) => {
    try {
      const result = await Accounts.getAccountDetails(
        accountId,
        credentials,
      ).then((res) => dispatch(setAccountDetails(res)));
      if (result.error) return;
    } catch (err) {
      return err;
    }
  };

export default getAccountDetails;
