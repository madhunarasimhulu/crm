import { Wallet } from '../clients';
import { setCard } from '.';

const updateCard =
  (cardId, data = {}, credentials) =>
  (dispatch) =>
    Wallet.updateCard(cardId, data, credentials).then((newCard) =>
      dispatch(setCard(newCard)),
    );

export default updateCard;
