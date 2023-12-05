import axios from 'axios';
import setup from '../setup';

import serviceProblems from '../../mock/dispute_service_problems.json';
import disagreements from '../../mock/dispute_disagreements.json';

const client = setup(
  axios.create({ baseURL: 'https://dispute-tree.pismolabs.io' }),
);

class DisputeTree {
  static getServiceProblems() {
    return new Promise((resolve) => {
      resolve(serviceProblems);
    });
  }

  static getDisagreement() {
    return new Promise((resolve) => {
      resolve(disagreements);
    });
  }
}

export { client };
export default DisputeTree;
