import { DisputeTree } from '../clients';
import { setDisputeTreeDisagreement } from '.';
import { logError } from '../utils';

const getDisputeTreeDisagreement = () => (dispatch) =>
  DisputeTree.getDisagreement()
    .then((data) => dispatch(setDisputeTreeDisagreement(data)))
    .catch(logError);

export default getDisputeTreeDisagreement;
