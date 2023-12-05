import { Accounts } from '../clients';
import { logError } from '../utils';
import setAccountProgramTypesList from './setAccountProgramTypesList';
import showToast from './showToast';

const getAccountProgramsTypesList = (credentials) => (dispatch) => {
  Accounts.getProgramTypesList(credentials)
    .then((data) => {
      dispatch(setAccountProgramTypesList(data));
      return data;
    })
    .catch(() => {
      dispatch(
        showToast({
          message: 'something went wrong fetching programs',
          style: 'error',
        }),
      );
      logError();
    });
};

export default getAccountProgramsTypesList;
