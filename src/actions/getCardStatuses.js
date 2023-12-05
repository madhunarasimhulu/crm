import { Wallet } from '../clients';
import setCardStatuses from './setCardStatuses';
import { logError } from '../utils';

const getCardStatuses = (credentials) => (dispatch) =>
  Wallet.getStatuses(credentials)
    .then((data) => dispatch(setCardStatuses(data)))
    .catch(logError);

export default getCardStatuses;
