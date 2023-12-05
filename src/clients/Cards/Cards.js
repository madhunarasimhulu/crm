import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import { getBaseAPIURL, mountPismoAuthHeaders, mapCards } from '../../utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/cards`,
  }),
);

class Cards {
  static getCards(customerId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/customers/${customerId}/cards?scope=attendant`, {
          headers: mountPismoAuthHeaders(credentials),
          params: {
            page: 1,
            perPage: 999,
            limit: 999,
          },
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res;
        })
        .then((res) => res.data)
        .then((res) => mapCards(res, customerId))
        .then(resolve)
        .catch(reject);
    });
  }

  static getCard(cardId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/cards/${cardId}`, {
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

  static unblock(customerId, accountId, cardId, credentials = {}) {
    return;
    return new Promise((resolve, reject) => {
      client
        .put(
          `/v1/customers/${customerId}/accounts/${accountId}/cards/${cardId}/unblock`,
          null,
          {
            headers: mountPismoAuthHeaders(credentials),
          },
        )
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }
}

export { client };
export default Cards;
