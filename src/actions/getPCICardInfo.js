import { PCICards } from '../clients';
import { setPCICardInfoLoading, setPCICardInfo, setPCICardError } from '.';

const getPCICardInfo = (cardId, credentials) => (dispatch) => {
  dispatch(setPCICardInfoLoading(true));

  return PCICards.getCardInfo(cardId, credentials)
    .then((data) => dispatch(setPCICardInfo(data)))
    .catch((err) => {
      dispatch(setPCICardError());
      throw err;
    });
};

export default getPCICardInfo;
