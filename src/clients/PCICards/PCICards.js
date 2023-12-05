import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import {
  getBasePCIAPIURL,
  mountPismoAuthHeaders,
  mount42csAuthHeaders,
} from '../../utils';
// import pciCardMock from '../../mock/pci_card.json'

const baseURL = getBasePCIAPIURL();
const REACT_APP_42CS_AUTH_URL = process.env.REACT_APP_42CS_AUTH_URL;

const client = setup(
  axios.create({
    baseURL: `${baseURL}/pcicards/v2/pcicards`,
  }),
);

const otpClient = setup(
  axios.create({
    baseURL: REACT_APP_42CS_AUTH_URL,
  }),
);

class PCICards {
  static getCardInfo(cardId, credentials) {
    return new Promise((resolve, reject) =>
      // Uncomment below, and the mock.json line above, for mock testing

      // return window.setTimeout(() => {
      //   resolve(pciCardMock)
      // }, 2000)

      client
        .get(`/info/${cardId}`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then(clearCacheMiddleware(client))
        .then((res) => res.data)
        .then(resolve)
        .catch(reject),
    );
  }

  static updateCardPassword(cardId, pin, credentials = {}) {
    return new Promise((resolve, reject) => {
      client
        .put(
          `/card/${cardId}`,
          {
            pin,
          },
          {
            headers: mountPismoAuthHeaders(credentials),
          },
        )
        .then(clearCacheMiddleware(client))
        .then(resolve)
        .catch(reject);
    });
  }

  static generateOtpCardChangePin(data) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      otpClient
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

  static verifyOtpCardChangePin(data) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      otpClient
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

  static generateOtpCardActivation(data) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      otpClient
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

  static verifyAOtpCardActivation(data) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      otpClient
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

  static verifyCardPciDetails(data) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      otpClient
        .post(`/customer/card/verify`, data, {
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

  static changeCustomerPhysicalAddress(data) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      otpClient
        .post(`/customer/card/change/address`, data, {
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
export default PCICards;
