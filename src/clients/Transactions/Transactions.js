import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import { getBaseAPIURL, mountPismoAuthHeaders } from '../../utils';
import { client as accountsClient } from '../Accounts';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/transactions`,
  }),
);

class Transactions {
  static getDisputes(filter, status, credentials = {}) {
    const params = {
      filter,
      status,
    };

    return new Promise((resolve, reject) => {
      client
        .get('/v2/disputes', {
          headers: mountPismoAuthHeaders(credentials),
          params,
        })
        .then(resolve)
        .catch(reject);
    });
  }

  static createDispute(
    accountId,
    authorizationId,
    reason,
    comment,
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      client
        .post(
          /*
          `/v2/disputes`,
          {
            account_id: accountId,
            authorization_id: authorizationId,
            reason,
            comment,
          },
           */
          `/v2/disputes/${authorizationId}`,
          {
            reason_code: reason.code,
            comment,
          },
          {
            headers: mountPismoAuthHeaders(credentials),
          },
        )
        .then(clearCacheMiddleware(accountsClient))
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }
}

export { client };
export default Transactions;
