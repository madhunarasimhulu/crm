import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import { client as CardsClient } from '../Cards';
import { getBaseAPIURL, mountPismoAuthHeaders, mapCards } from '../../utils';
import Customers from 'clients/Customers';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/wallet`,
  }),
);

/*
"e-ecommerce" - "descartavel", mas pode ser reativado
"recurrence" - cartao que o usuario gravaria no seu perfil em e-commerces
"subscription" - uso recorrente, assinaturas
*/
const cardTypesLabelsAsConstants = {
  ecommerce: 'VIRTUAL',
  recurrence: 'VIRTUAL',
  subscription: 'VIRTUAL',
};

export { client };
export default class Wallet {
  /*
  Este endpoint ainda nao tinha documentacao no Apiary,
  e o que existia (/v2/cards) aplica-se apenas para
  o cenario do cliente (nao um operador)
  Os dados requeridos sao:
  {
    program: {
      id: 2
    },
    customer: {
      id: 20493
    },
    account: {
      id: 16412
    },
    name: "PLASTIC",
    type: "PLASTIC"
  }
  */
  static createCard(
    programId,
    customerId,
    accountId,
    cardName,
    cardType,
    cardColor,
    credentials = {},
  ) {
    const body = {
      program: {
        id: programId,
      },
      customer: {
        id: customerId,
      },
      account: {
        id: accountId,
      },
      name: cardName,
      type: cardTypesLabelsAsConstants[cardType],
      metadata: {
        color: cardColor,
      },
      cvv_rotation_interval_hours:
        process.env.REACT_APP_CVV_ROTATION_INTERVAL_HOURS,
    };
    return client
      .post(`/v2/cards`, body, {
        headers: {
          ...mountPismoAuthHeaders(credentials),
          'x-customer-id': sessionStorage.getItem('pismo-customer-id'),
        },
      })
      .then(clearCacheMiddleware(CardsClient))
      .then(clearCacheMiddleware(client));
  }

  static createCardWithLimit(
    programId,
    customerId,
    accountId,
    cardName,
    cardType,
    limit,
    cardColor,
    credentials = {},
  ) {
    return Wallet.createCard(
      programId,
      customerId,
      accountId,
      cardName,
      cardType,
      cardColor,
      credentials,
    ).then(async (res) => {
      if (!res || !res.data || !res.data.id)
        throw new Error('It wasnt possible to create the card.');

      return client
        .patch(
          `/v2/cards/${res.data.id}`,
          {
            transaction_limit: limit,
          },
          {
            headers: {
              ...mountPismoAuthHeaders(credentials),
              'x-customer-id': sessionStorage.getItem('pismo-customer-id'),
            },
          },
        )
        .then(clearCacheMiddleware(CardsClient))
        .then(clearCacheMiddleware(client))
        .then(() => res.data);
    });
  }

  static async updateCard(cardId, data, credentials) {
    return client
      .patch(`/v2/cards/${cardId}`, data, {
        headers: {
          ...mountPismoAuthHeaders(credentials),
          'x-customer-id': sessionStorage.getItem('selectedCardCustomerId'),
        },
      })
      .then(clearCacheMiddleware(CardsClient))
      .then(clearCacheMiddleware(client))
      .then((res) => res.data);
  }

  // Verifying the FRM Block Card

  static async verifyFRMBlock(cardId) {
    let accountId = sessionStorage.getItem('pismo-account-id');
    let resp = await Customers.getAccountStatus(accountId).catch((e) => null);
    if (!!!resp)
      return { status: false, message: 'Unable to Get Account Status' };
    let { custom_fields } = resp?.data ?? {};
    // Parsing Custom Fields
    try {
      custom_fields = JSON.parse(custom_fields);
    } catch (error) {
      custom_fields = {};
    }

    let { frm_block } = custom_fields ?? {};

    if (!Array.isArray(frm_block)) return { status: true };

    if (!frm_block.includes(cardId)) return { status: true, message: '' };
    else
      return {
        status: false,
        message:
          'Your Card is Blocked due to Suspected Fraudulent activity, Please contact the Customer Care Center for Unblocking it',
      };
  }

  static temporaryBlockCard(cardId, credentials) {
    return this.updateCard(cardId, { status: 'BLOCKED' }, credentials);
  }

  static async temporaryUnblockCard(cardId, credentials, closeModal) {
    let frmStatus = await this.verifyFRMBlock(cardId);
    if (!frmStatus.status) {
      closeModal();
      return Promise.reject({
        response: { message: frmStatus.message },
      });
    }
    return this.updateCard(cardId, { status: 'NORMAL' }, credentials);
  }

  static getCards(customerId, accountId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/customers/${customerId}/accounts/${accountId}/cards`, {
          headers: {
            ...mountPismoAuthHeaders(credentials),
            'x-customer-id': customerId,
          },
          params: {
            page: 1,
            perPage: 999,
            timestamp: Date.now(),
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
        .catch((err) => {
          if (err.response.status === 404) {
            return reject(err.response.data);
          } else {
            return reject(err);
          }
          // if (!err || (err && err.response && err.response.status !== 404)) {
          //   return reject(err);
          // }
          // return resolve([]);
        });
    });
  }

  static getCard(cardId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/cards/${cardId}`, {
          headers: {
            ...mountPismoAuthHeaders(credentials),
            'x-customer-id': sessionStorage.getItem('selectedCardCustomerId'),
          },
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

  static deleteCard(cardId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .delete(`/v2/cards/${cardId}`, {
          headers: {
            ...mountPismoAuthHeaders(credentials),
            'x-customer-id': sessionStorage.getItem('selectedCardCustomerId'),
          },
        })
        .then(clearCacheMiddleware(CardsClient))
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }

  static activate(customerId, accountId, cardId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .put(
          `/v1/customers/${customerId}/accounts/${accountId}/cards/${cardId}/activate`,
          null,
          {
            headers: {
              ...mountPismoAuthHeaders(credentials),
              'x-customer-id': customerId,
            },
          },
        )
        .then(clearCacheMiddleware(client))
        .then(clearCacheMiddleware(CardsClient))
        .then(resolve)
        .catch(reject);
    });
  }

  static getNewCardReasons({ credentials = {} }) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/cards/reissue/reasons`, {
          headers: {
            ...mountPismoAuthHeaders(credentials),
            'x-customer-id': sessionStorage.getItem('selectedCardCustomerId'),
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

  static submitNewCardReason({
    customerId,
    accountId,
    cardId,
    reasonId: reason_id,
    credentials = {},
  }) {
    return new Promise((resolve, reject) => {
      client
        .post(
          `v1/customers/${customerId}/accounts/${accountId}/cards/${cardId}/reissue`,
          { reason_id },
          {
            headers: {
              ...mountPismoAuthHeaders(credentials),
              'x-customer-id': sessionStorage.getItem('selectedCardCustomerId'),
            },
          },
        )
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

  static getStatuses(credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/cards/statuses`, {
          headers: {
            ...mountPismoAuthHeaders(credentials),
            'x-customer-id': sessionStorage.getItem('selectedCardCustomerId'),
          },
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

  static changeStatus(
    customerId,
    accountId,
    cardId,
    status,
    recreate,
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      client
        .put(
          `/v1/customers/${customerId}/accounts/${accountId}/cards/${cardId}/status`,
          {
            customerId,
            accountId,
            id: cardId,
            status,
            recreate,
          },
          {
            headers: {
              ...mountPismoAuthHeaders(credentials),
              'x-customer-id': sessionStorage.getItem('selectedCardCustomerId'),
            },
          },
        )
        .then(clearCacheMiddleware(client))
        .then(clearCacheMiddleware(CardsClient))
        .then(resolve)
        .catch(reject);
    });
  }
}
