import { Wallet, Cards } from '../clients';
import { setCard } from '.';
import { logError } from '../utils';

const getCard = (cardId, credentials) => async (dispatch) => {
  try {
    const cardData = await Cards.getCard(cardId, credentials);
    const walletCardData = await Wallet.getCard(cardId, credentials);

    dispatch(setCard({ ...cardData, metadata: walletCardData.metadata }));
  } catch (error) {
    logError(error);
  }
};

export default getCard;
