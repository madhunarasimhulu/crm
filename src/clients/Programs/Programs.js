import axios from 'axios';
import setup from '../setup';
import { getBaseAPIURL, mountPismoAuthHeaders } from '../../utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/orgs`,
  }),
);

class Programs {
  static getProgram(programId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/programs/${programId}`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res;
        })
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }
}

export { client };
export default Programs;
