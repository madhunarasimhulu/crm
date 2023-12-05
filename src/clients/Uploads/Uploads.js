import axios from 'axios';
import setup from '../setup';
import { getBaseAPIURL } from '../../utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/uploads`,
  }),
);

class Uploads {
  static getCustomerAvatar(customerId, credentials = {}) {
    return new Promise((resolve) => resolve());
  }
}

export { client };
export default Uploads;
