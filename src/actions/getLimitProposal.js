import { Accounts } from '../clients';
import { setLimitProposal } from '.';
import { logError } from '../utils';

const getLimitProposal = (accountsLimitProposalId, credentials) => (dispatch) =>
  Accounts.getLimitProposal(accountsLimitProposalId, credentials)
    .then((data) => dispatch(setLimitProposal(data)))
    .catch(logError);

export default getLimitProposal;
