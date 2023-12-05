import axios from 'axios';
import formatDate from 'date-fns/format';
import setup, { clearCacheMiddleware } from '../setup';
import {
  getBaseAPIURL,
  mountPismoAuthHeaders,
  mount42csAuthHeaders,
  mapTotalDue,
  transformNotFound,
} from '../../utils';

const REACT_APP_42CS_AUTH_URL = process.env.REACT_APP_42CS_AUTH_URL;

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/statements`,
  }),
);
const clientStatementPdf = setup(
  axios.create({
    baseURL: `${REACT_APP_42CS_AUTH_URL}`,
  }),
);

const formatPaymentDate = (date) => formatDate(date, 'YYYY-MM-DD');

class Statements {
  static getTotalDue(
    accountId,
    date,
    type = 'INCLUDE_OPEN_STATEMENT',
    credentials,
  ) {
    const params = {
      type,
    };

    if (date) {
      params.paymentDate = formatPaymentDate(date);
    }

    return client
      .get(`/v1/accounts/${accountId}/total-due`, {
        params,
        headers: mountPismoAuthHeaders(credentials),
      })
      .catch(transformNotFound)
      .then(clearCacheMiddleware(client))
      .then((res) => res.data)
      .then(mapTotalDue);
  }

  static generatePayment(
    accountId,
    amount = 0,
    date = new Date(),
    credentials,
    send_email = false,
    send_sms = false,
  ) {
    const body = {
      amount: Math.round(amount * 100) / 100,
      send_email,
      send_sms,
    };

    return client
      .post(`/v2/accounts/${accountId}/payments`, body, {
        headers: mountPismoAuthHeaders(credentials),
      })
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }

  static getStatement(accountId, statementId, credentials) {
    return client
      .get(`/v1/accounts/${accountId}/statements/${statementId}`, {
        headers: mountPismoAuthHeaders(credentials),
      })
      .catch(transformNotFound)
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }

  // https://pismo.docs.apiary.io/#reference/statements/installments-details/retrieve-statement-installments-details
  static getSplitInvoiceOptions(accountId, upfrontAmount, credentials) {
    return client
      .get(`/v1/accounts/${accountId}/installments?upfront=${upfrontAmount}`, {
        headers: mountPismoAuthHeaders(credentials),
      })
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }

  // https://pismo.docs.apiary.io/#reference/statements/statement-info/generate-a-payment-in-installments
  static generateSplitInvoice(
    accountId,
    amount = 0,
    date = new Date(),
    numberInstallments,
    credentials,
    send_email = false,
    send_sms = false,
    statement_agreement = false,
  ) {
    const body = {
      first_payment_amount: Math.round(amount * 100) / 100,
      first_payment_date:
        typeof date === 'string' ? date : formatPaymentDate(date),
      number_of_installments: numberInstallments,
      send_email,
      send_sms,
      statement_agreement,
    };

    return client
      .post(`/v2/accounts/${accountId}/installment-payments`, body, {
        headers: mountPismoAuthHeaders(credentials),
      })
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }

  // get current open statement
  static getNextStatement(accountId, credentials) {
    return client
      .get(`/v1/accounts/${accountId}/next`, {
        headers: mountPismoAuthHeaders(credentials),
      })
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }

  // /v1/accounts/:accountId/transactions/:transactionId/installments
  static getAccountInstallments(accountId, transactionId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(
          `/v1/accounts/${accountId}/transactions/${transactionId}/installments`,
          {
            headers: mountPismoAuthHeaders(credentials),
          },
        )
        .then((res) => res.data)
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }

  // /v1/accounts/:accountId/transactions/:transactionId/installments
  static cancelAccountInstallments(accountId, transactionId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .delete(
          `/v1/accounts/${accountId}/transactions/${transactionId}/installments`,
          {
            headers: mountPismoAuthHeaders(credentials),
          },
        )
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }

  // /v1/accounts/:accountId/transactions/:transactionId/installments
  static advanceAccountInstallments(
    installmentsToAdvance,
    accountId,
    transactionId,
    credentials = {},
  ) {
    const body = {
      installments_to_advance: installmentsToAdvance,
    };

    return new Promise((resolve, reject) =>
      client
        .post(
          `/v1/accounts/${accountId}/transactions/${transactionId}/installments`,
          body,
          {
            headers: mountPismoAuthHeaders(credentials),
          },
        )
        .then((res) => res.data)
        .then(resolve)
        .catch(reject),
    );
  }

  static async getAgreementSummary(accountId, credentials = {}) {
    try {
      return await client.get(`v1/accounts/${accountId}/agreement-summary`, {
        headers: mountPismoAuthHeaders(credentials),
      });
    } catch (error) {
      return {
        data: error.response.data,
        error: true,
      };
    }
  }

  static async getAgreementDueDates(accountId, credentials = {}) {
    try {
      return await client.get(`v1/accounts/${accountId}/payment-due-dates`, {
        headers: mountPismoAuthHeaders(credentials),
      });
    } catch (error) {
      return {
        data: error.response.data,
        error: true,
      };
    }
  }

  static async getAgreementConditions(
    accountId,
    credentials = {},
    upFront,
    firstPaymentDate,
  ) {
    try {
      return await client.get(
        `v1/accounts/${accountId}/installments?firstPaymentDate=${firstPaymentDate}&statementAgreement=true&upfront=${upFront}`,
        {
          headers: mountPismoAuthHeaders(credentials),
        },
      );
    } catch (error) {
      return {
        data: error.response.data,
        error: true,
      };
    }
  }

  static async getStatements(accountId, credentials) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v2/accounts/${accountId}/statements`, {
          headers: { ...mountPismoAuthHeaders(credentials) },
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

  static async downloadStatement(data) {
    const params = { ...data, timestamp: Date.now() };
    return new Promise((resolve, reject) => {
      clientStatementPdf
        .get(`/statement/download`, {
          headers: mount42csAuthHeaders({}),
          params,
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
}

export { client };
export default Statements;
