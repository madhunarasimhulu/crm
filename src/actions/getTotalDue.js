import { Statements as StatementsClient } from '../clients';
import { setTotalDue, setTotalDueError } from '.';

const getTotalDue = (accountId, date, type, credentials) => (dispatch) =>
  StatementsClient.getTotalDue(accountId, date, type, credentials)
    .then((data) => dispatch(setTotalDue(data)))
    .catch((err) => dispatch(setTotalDueError(err)));

export default getTotalDue;
