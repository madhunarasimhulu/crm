import axios from 'axios';
import setup from '../setup';
import { getBaseAPIURL, mountPismoAuthHeaders } from '../../utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/auth`,
  }),
);

class Auth {
  static updatePassword(email, currentPassword, newPassword, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .put(
          `/v1/users/${email}/password`,
          {
            password: currentPassword,
            new_password: newPassword,
          },
          {
            headers: mountPismoAuthHeaders(credentials),
          },
        )
        .then(resolve)
        .catch(reject);
    });
  }
}

export { client };
export default Auth;
