import { Customers } from '../clients';
import { setAccountDueDate } from '.';

let refresh = false;
let DueDatData;

const getAccountDueDate = (accountId, credentials) => async (dispatch) => {
  try {
    if (refresh) return dispatch(setAccountDueDate(DueDatData));

    const res = await Customers.getAccountStatus(accountId, credentials);
    if (res.error) return;
    dispatch(setAccountDueDate(res.data));
    DueDatData = res.data;
    return DueDatData;
  } catch (err) {
    return err;
  }
};

export default getAccountDueDate;
