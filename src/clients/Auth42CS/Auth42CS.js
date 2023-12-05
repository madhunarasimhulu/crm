import axios from 'axios';
import setup from 'clients/setup';
import { mount42csAuthHeaders } from '../../utils';
import { onBoardingConfig } from 'utils/onBoarding/OnboardingConfig';

const REACT_APP_42CS_AUTH_URL = process.env.REACT_APP_42CS_AUTH_URL;

const client = setup(
  axios.create({
    baseURL: REACT_APP_42CS_AUTH_URL,
  }),
);

class Auth42CS {
  static login(data, JWT) {
    return new Promise((resolve, reject) => {
      if (!data.encReq) {
        reject({ message: 'Data is Empty' });
      }
      let headers = null;
      if (data?.clientId === onBoardingConfig.CL_00UTKB.code)
        headers = { Authorization: `Bearer ${JWT}` };
      client
        .post(
          `/login`,
          data,
          !!headers
            ? {
                headers: headers,
              }
            : null,
        )
        .then(resolve)
        .catch(reject);
    });
  }
  static refresh(documentNumber) {
    const credentials = {};
    return new Promise((resolve, reject) => {
      if (!documentNumber) return;
      const data = { document_number: documentNumber };
      client
        .post(`/refresh`, data, {
          headers: mount42csAuthHeaders(credentials),
        })
        .then(resolve)
        .catch(reject);
    });
  }

  static loginwithAccountId(data) {
    const { documentId, accountId } = data;
    return new Promise((resolve, reject) => {
      if (data === '') {
        reject({ message: 'Data is Empty' });
      }
      client
        .post(`/login/${documentId}/accounts/${accountId}`, data, {
          headers: {
            'x-token': sessionStorage.getItem('pismo-passport-token'),
          },
        })
        .then(resolve)
        .catch(reject);
    });
  }
}

export { client };
export default Auth42CS;
