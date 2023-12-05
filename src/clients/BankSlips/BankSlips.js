import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import { getBaseAPIURL, mountPismoAuthHeaders } from '../../utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/bankslips`,
  }),
);

class BankSlips {
  static generateRecharge(
    accountId,
    amount = 0,
    registered = true,
    credentials,
    send_email = false,
    send_sms = false,
  ) {
    const body = {
      account_id: accountId,
      amount: Math.round(amount * 100) / 100,
      send_email,
      send_sms,
    };

    return client
      .post(`/v1/bankslips?registered=${registered}`, body, {
        headers: mountPismoAuthHeaders(credentials),
      })
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }
}

export { client };
export default BankSlips;
