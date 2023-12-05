import { Orgs } from '../clients/Orgs';
import { setPidLoading } from './setPidLoading';

export const submitPid = (data) => (dispatch) => {
  dispatch(setPidLoading(true));
  return Orgs.submitPid({
    token: data.token,
    credentials: data.credentials,
    data: {
      account: data.accountId,
      questions: data.answers,
    },
  })
    .then(() => dispatch(setPidLoading(false)))
    .catch((error) => {
      dispatch(setPidLoading(false));
      throw error;
    });
};
