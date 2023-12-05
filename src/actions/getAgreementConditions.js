import { Statements } from '../clients';
import { setAgreementConditions, setAgreementLoading } from '.';

const getAgreementConditions =
  (accountId, credentials, upFront, firstPayment) => (dispatch) => {
    dispatch(setAgreementLoading());
    return Statements.getAgreementConditions(
      accountId,
      credentials,
      upFront,
      firstPayment,
    ).then((response) => dispatch(setAgreementConditions(response.data)));
  };

export default getAgreementConditions;
