import axios from 'axios';
import setup from 'clients/setup';

const REACT_APP_42CS_AUTH_URL = process.env.REACT_APP_CUB_CALLBACK_URL;

const client = setup(
  axios.create({
    baseURL: REACT_APP_42CS_AUTH_URL,
  }),
);

class CUBCallback {
  static callbackReq(encData) {
    return new Promise((resolve, reject) => {
      const data = { encReq: encData };
      client
        .post(
          `/servlet/ibs.creditCard.servlet.IBSCreditCardServlet?encReq=${encData}`,
          data,
        )
        .then(resolve)
        .catch(reject);
    });
  }
}

export { client };
export default CUBCallback;
