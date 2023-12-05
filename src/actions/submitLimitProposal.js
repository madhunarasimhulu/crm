import { Accounts } from '../clients';
import { setLimitProposalOutcome, setLimitProposalSubmitting } from '.';

const submitLimitProposal =
  (accountId, body, max_limit, credentials) => (dispatch) => {
    dispatch(setLimitProposalSubmitting(true));

    const { new_limit } = body;
    let request;

    request = Accounts.changeLimitWithinApprovedRange(
      accountId,
      new_limit,
      credentials,
    );

    return request
      .then(() => dispatch(setLimitProposalOutcome('success')))
      .catch((err) => {
        dispatch(setLimitProposalOutcome('failure'));
        throw err;
      });
  };

export default submitLimitProposal;
