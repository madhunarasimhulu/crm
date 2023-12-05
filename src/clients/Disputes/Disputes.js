import axios from 'axios';
import setup from '../setup';
import { mountPismoAuthHeaders, getBaseAPIURL } from '../../utils';

const baseURL = getBaseAPIURL();
const client = setup(axios.create({ baseURL: `${baseURL}/disputes` }));

class Disputes {
  static async authorizeDispute(credentials, data) {
    let response = {};
    try {
      response = await client.post(`/v1/networkauthorization-disputes`, data, {
        headers: mountPismoAuthHeaders(credentials),
      });
    } catch (err) {
      response = {
        error: true,
      };
    }
    return response;
  }
}

export { client };
export default Disputes;
