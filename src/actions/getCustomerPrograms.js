import { Customers } from '../clients';
import setCustomerPrograms from './setCustomerPrograms';
import { logError } from '../utils';

export default function getCustomerPrograms(customer, credentials) {
  return (dispatch) => {
    const {
      entity: { id: entityId },
    } = customer;

    Customers.getCustomerPrograms(entityId, credentials)
      .then((data) => dispatch(setCustomerPrograms(data)))
      .catch(logError);
  };
}
