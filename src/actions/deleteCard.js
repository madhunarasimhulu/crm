import Wallet from '../clients/Wallet';
import CardsOnFile from '../clients/CardsOnFile';
import { isCreditProgramType } from '../utils';

const deleteCard =
  ({ programType, accountId, cardId }, credentials) =>
  () => {
    return;
    if (isCreditProgramType(programType)) {
      return Wallet.deleteCard(cardId, credentials);
    }
    return CardsOnFile.deleteCardOnFile({ cardId, accountId }, credentials);
  };

export default deleteCard;
