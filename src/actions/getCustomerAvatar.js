import { Uploads } from '../clients';
import { setCustomerAvatar } from '.';

const getCustomerAvatar = (customerId, credentials) => (dispatch) =>
  Uploads.getCustomerAvatar(customerId, credentials).then((data) =>
    dispatch(setCustomerAvatar(data)),
  );

export default getCustomerAvatar;
