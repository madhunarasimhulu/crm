import axios from 'axios';
import setup, { clearCacheMiddleware } from './setup';
import { getBaseAPIURL, mountPismoAuthHeaders } from '../utils';

const baseURL = getBaseAPIURL();

export const client = setup(
  axios.create({
    baseURL: `${baseURL}/crm`,
  }),
);

export class Orgs {
  static getPid({ credentials = {} }) {
    return new Promise((resolve, reject) => {
      client
        .get(`v1/orgs/${credentials.tenant}/pid`, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }

  static submitPid({ token, credentials = {}, data }) {
    return new Promise((resolve, reject) => {
      client
        .post(`v1/orgs/${credentials.tenant}/pid/${token}`, data, {
          headers: mountPismoAuthHeaders(credentials),
        })
        .then((res) => (!res || !res.data ? reject(res) : res))
        .then(clearCacheMiddleware(client))
        .then((res) => res.data)
        .then(resolve)
        .catch(reject);
    });
  }
}
