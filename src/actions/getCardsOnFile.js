import { CardsOnFile } from '../clients';
import { setCards } from '.';
import { logError } from '../utils';

const getCardsOnFile = (accountId, credentials) => (dispatch) =>
  CardsOnFile.getCardsOnFile(accountId, credentials)
    .then((data) => dispatch(setCards(data)))
    .catch(logError);

export default getCardsOnFile;
