import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import {
  getBaseAPIURL,
  mapTransactionsListToTransactionsCoreList,
  mapTransactionsItemToTransactionsCoreItem,
  mountPismoAuthHeaders,
} from '../../utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/transactions-core`,
  }),
);

class TransactionsCore {
  static getTransaction(transactionId, accountId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v2/transactions/${transactionId}`, {
          headers: mountPismoAuthHeaders({
            ...credentials,
            accountId,
            protocol: null,
          }),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }
          return res;
        })
        .then((res) => res.data)
        .then(mapTransactionsItemToTransactionsCoreItem)
        .then(resolve)
        .catch(reject);
    });
  }

  static getTransactionsTotals(
    accountId,
    statementId = null,
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      client
        .get('v2/transactions/total-items', {
          headers: mountPismoAuthHeaders({
            ...credentials,
            accountId,
            protocol: null,
          }),
          params: {
            statementId: statementId ?? null,
          },
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res;
        })
        .then((res) => res.data)
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }

  static getTransactions(
    accountId,
    statementId = null,
    startDate = null,
    endDate = null,
    order = 'desc',
    credentials = {},
    page = 0,
    itemsPerPage = 30,
  ) {
    return new Promise((resolve, reject) => {
      client
        .get('v2/transactions', {
          headers: mountPismoAuthHeaders({
            ...credentials,
            accountId,
            protocol: null,
          }),
          params: {
            statementId: statementId ?? null,
            // eventDateStart: startDate
            //   ? dayjs(startDate, DATE_DISPLAY).toISOString().replace('-00', '')
            //   : null,
            // eventDateEnd: endDate
            //   ? dayjs(endDate, DATE_DISPLAY).toISOString().replace('-00', '')
            //   : null,
            order: order ?? 'desc',
            pageSize: itemsPerPage,
            pageOffset: page,
            statementPost: true,
          },
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          if (!res.data.items) {
            res.data.items = [];
          }
          return res;
        })
        .then((res) => res.data)
        .then(mapTransactionsListToTransactionsCoreList)
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }
}

export { client };
export default TransactionsCore;
