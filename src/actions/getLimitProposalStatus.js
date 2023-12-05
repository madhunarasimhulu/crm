import { Accounts } from '../clients';
import { setLimitProposalStatus } from '.';
import { logError } from '../utils';

const getLimitProposalStatus = (accountId, credentials) => (dispatch) =>
  Accounts.getLimitProposalStatus(accountId, credentials)
    .then((data) => dispatch(setLimitProposalStatus(data)))
    .catch(logError);

export default getLimitProposalStatus;
