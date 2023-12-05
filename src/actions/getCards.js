import { Wallet, Cards } from '../clients';
import { setCards, setCardsFailure, setCardsLoading, showToast } from '.';
import { logError } from '../utils';

const getCards =
  (customerId, accountId, credentials, isCustomer) => (dispatch) => {
    let req;
    if (isCustomer) {
      req = Wallet.getCards(customerId, accountId, credentials);
    } else {
      req = Cards.getCards(customerId, credentials);
    }

    return req
      .then((data) => dispatch(setCards(data)))
      .catch((err) => {
        dispatch(setCardsFailure(err.message));
        if (err.message != 'No cards found') {
          dispatch(
            showToast({
              message: 'Something Went wrong',
              style: 'error',
            }),
          );
        }
      });
  };

export default getCards;
