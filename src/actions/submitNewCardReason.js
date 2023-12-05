import { Wallet } from '../clients';
import { logError } from '../utils';

const submitNewCardReason = (data) => () =>
  Wallet.submitNewCardReason(data).catch(logError);

export default submitNewCardReason;
