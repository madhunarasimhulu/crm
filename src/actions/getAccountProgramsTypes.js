import { Accounts } from '../clients';
import { logError } from '../utils';
import setAccountProgramTypes from './setAccountProgramsTypes';
import setAccProgramTypesLoading from './setAccProgramTypesLoading';
import showToast from './showToast';

const getAccountProgramsTypes = (credentials) => (dispatch) => {
  dispatch(setAccProgramTypesLoading(true));
  Accounts.findByDocument(credentials)
    .then((data) => {
      dispatch(setAccProgramTypesLoading(false));
      dispatch(setAccountProgramTypes(data));
      return data;
    })
    .catch(() => {
      dispatch(
        showToast({
          message: 'something went wrong fetching programs',
          style: 'error',
        }),
      );
      dispatch(setAccProgramTypesLoading(false));
      logError();
    });
};

export default getAccountProgramsTypes;
