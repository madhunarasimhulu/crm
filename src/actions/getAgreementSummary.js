import { Statements } from '../clients';
import { logError } from '../utils';
import { setAgreementSummary, setAgreementLoading } from '.';

const getAgreementSummary = (accountId, credentials) => (dispatch) => {
  dispatch(setAgreementLoading());
  return Statements.getAgreementSummary(accountId, credentials)
    .then((response) => dispatch(setAgreementSummary(response.data)))
    .catch(logError);
};

export default getAgreementSummary;
