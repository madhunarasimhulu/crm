import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import { getBaseAPIURL, mountPismoAuthHeaders } from '../../utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/payment-gateway`,
  }),
);

class PaymentGateway {
  static issueBankInvoice(accountId, amount, credentials = {}) {
    const body = {
      amount,
      account: {
        id: accountId,
      },
    };

    return new Promise((resolve, reject) => {
      client
        .post('/v1/boleto?output=BARCODE_NUMBER', body, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res;
        })
        .then((res) => res.data)
        .then((data) => {
          if (!data || !data.content || !data.content.length) {
            return reject();
          }

          return data.content;
        })
        .then(resolve)
        .catch(reject);
    }).then(clearCacheMiddleware(client));
  }
}

export { client };
export default PaymentGateway;
