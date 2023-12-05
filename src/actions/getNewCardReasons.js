import { Wallet } from '../clients';
import { setNewCardReasons } from '.';
import { logError } from '../utils';

const getNewCardReasons = (data) => (dispatch) =>
  Wallet.getNewCardReasons(data)
    .then((data) => dispatch(setNewCardReasons(data)))
    .catch(logError);

export default getNewCardReasons;
