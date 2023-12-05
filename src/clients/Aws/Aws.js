import axios from 'axios';
import setup from '../setup';
import { getBaseAPIURL, mountPismoAuthHeaders } from '../../utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/auth/v1`,
  }),
);

class Aws {
  static getAwsCredentials(email, password) {
    return new Promise((resolve, reject) => {
      client
        .post('users/login', {
          email,
          password,
        })
        .then(({ data }) => {
          client
            .get(`aws/sessiontoken`, {
              headers: mountPismoAuthHeaders(data),
            })
            .then(resolve)
            .catch(reject);
        });
    });
  }
}

export default Aws;
