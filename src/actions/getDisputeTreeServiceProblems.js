import { DisputeTree } from '../clients';
import { setDisputeTreeServiceProblems } from '.';
import { logError } from '../utils';

const getDisputeTreeServiceProblems = () => (dispatch) =>
  DisputeTree.getServiceProblems()
    .then((data) => dispatch(setDisputeTreeServiceProblems(data)))
    .catch(logError);

export default getDisputeTreeServiceProblems;
