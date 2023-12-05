import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import setup from '../setup';
import { getBaseAPIURL, mountPismoAuthHeaders } from '../../utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/payments`,
  }),
);

class Payments {
  static async getTransactionInfos(accountId, transactionId, credentials = {}) {
    let response = {};
    try {
      response = await client.get(`/v1/transactions/${transactionId}`, {
        headers: mountPismoAuthHeaders(credentials),
      });
    } catch (err) {
      response = {
        data: err.response.data,
        error: true,
      };
    }
    return response;
  }

  static async payStatement(accountId, amountInput, credentials = {}) {
    const tracking_id = uuidv4();
    let response = {};
    try {
      response = await client.post(
        `/v1/payments`,
        {
          tracking_id,
          descriptor: 'Credit card bill payed',
          from: [
            {
              custom_info: {
                type: 'Credit card bill payment',
                description: 'Payed by bank app',
              },
            },
          ],
          to: [
            {
              processing_code: '004000',
              account: { id: accountId },
              amount: amountInput,
            },
          ],
        },
        {
          headers: mountPismoAuthHeaders(credentials),
        },
      );
    } catch (err) {
      response = {
        data: err.response.data,
        error: true,
      };
    }
    return response;
  }

  static async p2p(
    accountFromId,
    accountToId,
    amount,
    descriptor,
    credentials = {},
  ) {
    const tracking_id = uuidv4();
    let response = {};
    try {
      response = await client.post(
        `/v1/payments`,
        {
          tracking_id,
          descriptor,
          from: [
            {
              amount: Number(amount),
              account: {
                id: accountFromId,
              },
            },
          ],
          to: [
            {
              account: { id: accountToId },
            },
          ],
        },
        {
          headers: mountPismoAuthHeaders(credentials),
        },
      );
    } catch (err) {
      response = {
        data: err.response.data,
        error: true,
      };
    }
    return response;
  }
}

export { client };
export default Payments;
