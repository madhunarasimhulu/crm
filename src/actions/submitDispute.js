import { Disputes } from '../clients';
import { setDisputeSubmitting } from '.';

const submitDispute = (credentials, data) => (dispatch) => {
  dispatch(setDisputeSubmitting(true));
  return Disputes.authorizeDispute(credentials, data);
};

export default submitDispute;
