import axios from 'axios';
import setup from '../setup';
import { getBaseAPIURL } from '../../utils';

import purchasesMock from '../../mock/purchases.json';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/crm`,
  }),
);

class CRM {
  // /v1/customers/:customerId/accounts/:accountId/purchases/:transactionId
  static getAccountTransaction(
    customerId,
    accountId,
    transactionId,
    credentials = {},
  ) {
    return new Promise((resolve) =>
      window.setTimeout(() => resolve(purchasesMock), 1000),
    );
  }
}

export { client };
export default CRM;
