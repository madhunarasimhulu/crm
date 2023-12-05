import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import {
  getBaseAPIURL,
  mountPismoAuthHeaders,
  mount42csAuthHeaders,
} from '../../utils';

const baseURL = getBaseAPIURL();
const REACT_APP_42CS_AUTH_URL = process.env.REACT_APP_42CS_AUTH_URL;

const client = setup(
  axios.create({
    baseURL: `${baseURL}/crm`,
  }),
);

const clientOrgs = setup(
  axios.create({
    baseURL: `${baseURL}/orgs`,
  }),
);

const clientDetail = setup(
  axios.create({
    baseURL: `${baseURL}/accounts`,
  }),
);

const clientOnboard = setup(
  axios.create({
    baseURL: REACT_APP_42CS_AUTH_URL,
  }),
);

class Customers {
  static find(term = '', credentials = {}) {
    return new Promise((resolve, reject) => {
      if (term.length < 4) {
        return resolve();
      }

      client
        .get(`/v1/customers/find/${term}`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res;
        })
        .then((res) => res.data)
        .then((data) => data.filter(({ name: cn }) => cn && cn.length > 0))
        .then(resolve)
        .catch(reject);
    });
  }

  static findV2(term = '', credentials = {}) {
    return new Promise((resolve, reject) => {
      if (term.length < 4) {
        return resolve();
      }

      client
        .get(`/v2/customers/find/${term}`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => {
          if (!res || !res.data) {
            return reject(res);
          }

          return res;
        })
        .then((res) => res.data)
        .then((data) => data.filter(({ name: cn }) => cn && cn.length > 0))
        .then(resolve)
        .catch(reject);
    });
  }

  static updateDueDateParameter(
    id,
    programId,
    costumerId,
    accountId,
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      clientDetail
        .put(
          `v1/accounts/${accountId}/duedate`,
          { program_due_date_id: id },
          { headers: mountPismoAuthHeaders(credentials) },
        )
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }

  static getCustomerDueDate(programId, credentials = {}) {
    return new Promise((resolve, reject) => {
      clientOrgs
        .get(`v1/programs/${programId}/duedates`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }

  static getCustomerDetail(customerId, accountId, credentials = {}) {
    return clientDetail
      .get(`v1/accounts/${accountId}/customers/${customerId}/detail`, {
        headers: {
          ...mountPismoAuthHeaders(credentials),
          'x-account-id': accountId,
        },
      })
      .then((res) => res)
      .then((res) => res.data);
  }

  static async getAccountStatus(accountId, credentials = {}) {
    const cacheBuster = (url) => `${url}?cb=${Date.now()}`;
    try {
      return await clientDetail.get(cacheBuster(`/v1/accounts/${accountId}`), {
        headers: { ...mountPismoAuthHeaders(credentials) },
      });
    } catch (err) {
      return { error: true };
    }
  }

  // For Coral

  static updateCustomFields(accountId, custom_fields) {
    return new Promise((resolve, reject) => {
      clientDetail
        .patch(
          `/v1/accounts/${accountId}`,
          {
            custom_fields: custom_fields,
          },
          {
            headers: mountPismoAuthHeaders({}),
          },
        )
        .then(resolve)
        .catch(reject);
    });
  }

  static getCustomerPrograms(customerId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(`/v1/customers/${customerId}/programs`, {
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

  static openCustomerProtocol(customerId, accountId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .post(
          `/v1/customers/${customerId}/accounts/${accountId}/protocol`,
          null,
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
        .catch(reject);
    });
  }

  static closeCustomerProtocol(
    customerId,
    accountId,
    protocol,
    credentials = {},
    attendanceNotes = '',
  ) {
    return new Promise((resolve, reject) => {
      client
        .post(
          `/v1/customers/${customerId}/accounts/${accountId}/protocol/${protocol}/close`,
          { additional_info: { text: attendanceNotes } },
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
        .catch(reject);
    });
  }

  static addCustomerPhone(customerId, accountId, credentials = {}, data) {
    return new Promise((resolve, reject) => {
      client
        .post(
          `/v1/customers/${customerId}/accounts/${accountId}/phones`,
          data,
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
        .catch(reject);
    });
  }

  static updateCustomerAddress(
    customerId,
    accountId,
    credentials = {},
    data,
    replace,
  ) {
    const replaceQueryStr = replace ? '?replace=true' : '';

    return new Promise((resolve, reject) => {
      client
        .post(
          `/v1/customers/${customerId}/accounts/${accountId}/addresses${replaceQueryStr}`,
          data,
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
        .catch(reject);
    });
  }

  static removeCustomerAddress(customerId, accountId, credentials = {}, id) {
    return new Promise((resolve, reject) => {
      client
        .delete(
          `/v1/customers/${customerId}/accounts/${accountId}/addresses/${id}`,
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
        .catch(reject);
    });
  }

  static getCustomerAddressesHistory(
    customerId,
    accountId,
    credentials = {},
    active,
    type,
  ) {
    let complementaryQueryStr = '';

    if (active !== undefined && type !== undefined) {
      complementaryQueryStr = `?active=${active}&type=${type}`;
    } else if (active === undefined && type !== undefined) {
      complementaryQueryStr = `?type=${type}`;
    } else if (active !== undefined && type === undefined) {
      complementaryQueryStr = `?active=${active}`;
    }

    return new Promise((resolve, reject) => {
      client
        .get(
          `/v1/customers/${customerId}/accounts/${accountId}/addresses${complementaryQueryStr}`,
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
        .catch(reject);
    });
  }

  static getCustomerPhonesHistory(
    customerId,
    accountId,
    credentials = {},
    active,
    type,
  ) {
    let complementaryQueryStr = '';

    if (active !== undefined && type !== undefined) {
      complementaryQueryStr = `?active=${active}&type=${type}`;
    } else if (active === undefined && type !== undefined) {
      complementaryQueryStr = `?type=${type}`;
    } else if (active !== undefined && type === undefined) {
      complementaryQueryStr = `?active=${active}`;
    }

    return new Promise((resolve, reject) => {
      client
        .get(
          `/v1/customers/${customerId}/accounts/${accountId}/phones${complementaryQueryStr}`,
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
        .catch(reject);
    });
  }

  static submitCustomerOnboard(data) {
    return new Promise((resolve, reject) => {
      clientOnboard
        .post(`/customer/onboard`, data, {
          headers: {
            ...mount42csAuthHeaders({}),
            'Content-Type': 'application/json',
          },
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

  static getCustomerOnboardOtp(data) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      clientOnboard
        .post(`/api/v1/otp/send`, data, {
          headers: {
            ...mount42csAuthHeaders(credentials),
            'Content-Type': 'application/json',
          },
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

  static submitCustomerOnboardOtp(data) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      clientOnboard
        .post(`/api/v1/otp/verify`, data, {
          headers: {
            ...mount42csAuthHeaders(credentials),
            'Content-Type': 'application/json',
          },
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
}

export { client };
export default Customers;
