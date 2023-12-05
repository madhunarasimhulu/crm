import { Statements } from '../clients';
import { logError } from '../utils';
import { setAgreementDueDates, setAgreementLoading } from '.';

const getAgreementDueDates = (accountId, credentials) => (dispatch) => {
  dispatch(setAgreementLoading());
  return Statements.getAgreementDueDates(accountId, credentials)
    .then((response) => dispatch(setAgreementDueDates(response.data)))
    .catch(logError);
};

export default getAgreementDueDates;
