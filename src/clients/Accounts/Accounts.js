import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import {
  getBaseAPIURL,
  mountPismoAuthHeaders,
  flattenStatements,
  mapTransactions,
  mount42csAuthHeaders,
} from '../../utils';

import { client as customersClient } from '../Customers';
import { client as cardsClient } from '../Cards';
import { CoralAPI } from 'clients/coral';
import { Auth } from 'aws-amplify';
import { AdminGroups } from 'utils/coral/TenantConfig';
const REACT_APP_42CS_AUTH_URL = process.env.REACT_APP_42CS_AUTH_URL;

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/accounts`,
  }),
);

const clientPrograms = setup(
  axios.create({
    baseURL: `${baseURL}`,
  }),
);
const clientLedger = setup(
  axios.create({
    baseURL: `${baseURL}/ledger`,
  }),
);

const client42CS = setup(
  axios.create({
    baseURL: `${REACT_APP_42CS_AUTH_URL}`,
  }),
);

class Accounts {
  static getAccountParameters(accountId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/accounts/${accountId}/parameters`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }

  static updateAccountParameters(
    value,
    parameterId,
    accountId,
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      client
        .put(
          `v1/accounts/${accountId}/parameters/${parameterId}`,
          { value },
          { headers: mountPismoAuthHeaders(credentials) },
        )
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }

  static getStatements(accountId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/accounts/${accountId}/statements`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res;
        })
        .then((res) => res.data)
        .then(flattenStatements)
        .then(resolve)
        .catch(reject);
    });
  }

  static getLatestAuthorizations(customerId, credentials = {}) {
    return new Promise((resolve, reject) => {
      // TODO: make pagination
      client
        .get(`/v1/customers/${customerId}/authorizations?page=1&perPage=10`, {
          headers: mountPismoAuthHeaders(credentials),
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

  static getCancelledAuthorizations({ accountId, page, credentials = {} }) {
    return new Promise((resolve, reject) => {
      client
        .get(
          `/v1/accounts/${accountId}/authorizations?status=NEGADO&page=${page}&perPage=50`,
          {
            headers: mountPismoAuthHeaders(credentials),
          },
        )
        .then((res) => (!res || !res.data ? reject(res) : res))
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }

  static sendBy(accountId, statementId, how, credentials = {}) {
    return client
      .post(
        `/v1/accounts/${accountId}/statements/${statementId}/transactions/${how}`,
        {},
        {
          headers: mountPismoAuthHeaders(credentials),
        },
      )
      .then(clearCacheMiddleware(client));
  }

  static sendByEmail(accountId, statementId, credentials) {
    return this.sendBy(accountId, statementId, 'email', credentials);
  }

  static sendBySMS(accountId, statementId, credentials) {
    return this.sendBy(accountId, statementId, 'sms', credentials);
  }

  static addNewCard(accountId, newCard, credentials = {}) {
    return client
      .post(`/v1/accounts/${accountId}/additionals`, newCard, {
        headers: mountPismoAuthHeaders(credentials),
      })
      .then(clearCacheMiddleware(client))
      .then(clearCacheMiddleware(cardsClient))
      .then(clearCacheMiddleware(customersClient));
  }

  static addCustomerPhone(customerId, accountId, credentials = {}, data) {
    return new Promise((resolve, reject) => {
      client
        .post(`/v1/accounts/${accountId}/phones`, data, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res;
        })
        .then(clearCacheMiddleware(client))
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }

  static updateCustomer(customerId, accountId, credentials = {}, data) {
    // Create a copy of the data object, because we don't want to modify the original object
    const clonedData = JSON.parse(JSON.stringify(data));

    // document_number does not need to be sent/modified to the API
    if (clonedData.document_number) delete clonedData.document_number;

    // At now, emai does not need to be sent/modified to the API too
    // if (clonedData.email) delete clonedData.email

    // message: "Unable to update 'partner' and 'partners'. Only one of these fields should be passed."
    if (clonedData.partner) delete clonedData.partner;

    return new Promise((resolve, reject) =>
      client
        .patch(
          `/v1/accounts/${accountId}/customers/${customerId}/detail`,
          clonedData,
          {
            headers: mountPismoAuthHeaders(credentials),
          },
        )
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res;
        })
        .then(clearCacheMiddleware(client))
        .then((res) => res.data)
        .then(resolve)
        .catch(reject),
    );
  }

  static getLimitProposal(accountsLimitProposalsId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/limit-proposals/${accountsLimitProposalsId}`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }

  static async changeLimitWithinApprovedRange(
    accountId,
    limit,
    credentials = {},
  ) {
    return new Promise((resolve, reject) =>
      clientLedger
        .patch(
          `/v1/accounts/${accountId}/limits`,
          { total_credit_limit: limit },
          {
            headers: mountPismoAuthHeaders(credentials),
          },
        )
        .then(clearCacheMiddleware(clientLedger))
        .then(clearCacheMiddleware(customersClient))
        .then((res) => res.data)
        .then(resolve)
        .catch(reject),
    );
  }

  static async getAccountLimits(accountId, credentials) {
    return new Promise((resolve, reject) => {
      clientLedger
        .get(`/v1/accounts/${accountId}/limits?t=${Math.random(9)}`, {
          headers: {
            ...mountPismoAuthHeaders(credentials),
          },
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res.data;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  // /v1/accounts/:accountId/transactions?beginDate=19%2F07%2F2018&endDate=26%2F07%2F2018&order=desc&page=1&perPage=5
  static getAccountTransactions(
    accountId,
    rangeDates = {},
    order = 'desc',
    page = 1,
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/accounts/${accountId}/transactions?page=${page}&perPage=10`, {
          headers: mountPismoAuthHeaders(credentials),
          params: {
            ...rangeDates,
            order,
          },
        })
        .then((res) => res.data)
        .then(clearCacheMiddleware(client))
        .then(mapTransactions)
        .then(resolve)
        .catch(reject);
    });
  }

  static async getAccountDetails(accountId, credentials) {
    return new Promise((resolve, reject) => {
      CoralAPI.get(`/accounts/${accountId}`)
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res.data;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  static getAccountTransaction(accountId, transactionId, credentials) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/accounts/${accountId}/transactions/${transactionId}`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => res.data)
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }

  static updateStatus({ accountId, status, reason }, credentials = {}) {
    return client
      .patch(
        `/v2/accounts/${accountId}/status`,
        { status, reason },
        {
          headers: mountPismoAuthHeaders(credentials),
        },
      )
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }

  static getStatuses(credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/account-status`, {
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

  static getStatusesReasons(accountStatusId = null, credentials = {}) {
    return new Promise((resolve, reject) => {
      const queryParam = accountStatusId
        ? `?accountStatusId=${accountStatusId}`
        : '';

      client
        .get(`/v1/accounts-status/reasons${queryParam}`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }

  static findByDocument(credentials = {}) {
    return new Promise((resolve, reject) => {
      client42CS
        .get(`/accounts/search`, {
          headers: mount42csAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res;
        })
        .then((res) => res.data)
        .then(clearCacheMiddleware(client42CS))
        .then(resolve)
        .catch(reject);
    });
  }

  static getProgramTypesList(credentials = {}) {
    return new Promise((resolve, reject) => {
      clientPrograms
        .get(`/programs/v1/programs`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }
          return res;
        })
        .then((res) => res.data)
        .then(clearCacheMiddleware(clientPrograms))
        .then(resolve)
        .catch(reject);
    });
  }

  static async getAccountAddresses(accountId, credentials) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/accounts/${accountId}/addresses`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res.data;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  static async getAccountCustomerDetails(customerId, credentials) {
    return new Promise((resolve, reject) => {
      CoralAPI.get(`/customers/${customerId}`)
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res.data;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  static async getAccountCustomerList(accountId, credentials) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v2/accounts/${accountId}/customers`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res.data;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  static async getAccountPhones(accountId, credentials) {
    return new Promise(async (resolve, reject) => {
      CoralAPI.get(`accounts/${accountId}/phones`)
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res.data;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  static async updateAccountPhone(accountId, phoneId, payload, credentials) {
    return new Promise((resolve, reject) => {
      client
        .patch(`/v1/accounts/${accountId}/phones/${phoneId}`, payload, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res.data;
        })
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }

  static async createAccountAddress(accountId, data, credentials) {
    return client
      .post(`/v1/accounts/${accountId}/addresses`, data, {
        headers: mountPismoAuthHeaders(credentials),
      })
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }

  static async updateAccountAddress(accountId, addressId, data, credentials) {
    return client
      .patch(`/v1/accounts/${accountId}/addresses/${addressId}`, data, {
        headers: mountPismoAuthHeaders(credentials),
      })
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }

  static async removeAccountAddress(accountId, addressId, credentials) {
    return client
      .patch(
        `/v1/accounts/${accountId}/addresses/${addressId}`,
        {
          active: false,
        },
        {
          headers: mountPismoAuthHeaders(credentials),
        },
      )
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }
}

export { client, clientLedger, client42CS };
export default Accounts;
