import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import { mount42csAuthHeaders } from '../../utils';
import { CoralAPI } from 'clients/coral';

const REACT_APP_42CS_AUTH_URL = process.env.REACT_APP_42CS_AUTH_URL;

const client = setup(
  axios.create({
    baseURL: `${REACT_APP_42CS_AUTH_URL}/request`,
  }),
);

class ServiceRequests {
  static submitNewServiceRequest(data) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      CoralAPI.post(`/raise`, data, {
        headers: {
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

  static getServiceHistory(params) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      CoralAPI.get(`/list`, {
        params,
      })
        .then((res) => res)
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }
  static getServiceRequestDetails(params) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      CoralAPI.get(`/info`, {
        params,
      })
        .then((res) => res)
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }
}

export default ServiceRequests;
