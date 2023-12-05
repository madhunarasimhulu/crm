import { Accounts } from '../clients';
import { setStatementsLoading, setStatements } from '.';
import { logError } from '../utils';

export default function getAccountStatements(
  accountId,
  statementId,
  openDueDate,
  lastestStatementId,
  credentials,
) {
  return (dispatch) => {
    dispatch(setStatementsLoading(true));

    return Accounts.getStatements(accountId, credentials)
      .then((data) => {
        const mappedData = data.map((statement) => ({
          ...statement,
          isSelected: parseInt(statementId, 10) === statement.statement.id,
          isDue: false,
          isCurrent:
            parseInt(lastestStatementId, 10) === statement.statement.id,
        }));

        dispatch(setStatements(mappedData));

        return mappedData;
      })
      .catch(logError);
  };
}
