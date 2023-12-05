import { TransactionsCore } from '../clients';
import { getRequestErrorMessage } from '../utils';
import setStatementTransactions from './setStatementTransactions';

export default function getStatementTransactions(
  accountId,
  statements,
  credentials,
  page = 0,
  itemsPerPage = 30,
) {
  return (dispatch) => {
    const { selectedMonth } = statements;
    const {
      statement: { id: statementId },
    } = selectedMonth;

    return TransactionsCore.getTransactionsTotals(
      accountId,
      statementId,
      credentials,
    )
      .then((dataTotals) => {
        const totalPages = Math.ceil(dataTotals.total_items / itemsPerPage);

        TransactionsCore.getTransactions(
          accountId,
          statementId,
          null,
          null,
          null,
          credentials,
          page,
          itemsPerPage,
        )
          .then((data) => {
            if (data) {
              dispatch(
                setStatementTransactions({
                  ...data,
                  totalPages,
                  itemsPerPage,
                  currentPage: page,
                }),
              );
            } else {
              dispatch(setStatementTransactions([]));
            }
          })
          .catch((err) =>
            dispatch(
              setStatementTransactions({
                error: true,
                errorMsg: getRequestErrorMessage(err),
              }),
            ),
          );
      })
      .catch((err) =>
        dispatch(
          setStatementTransactions({
            error: true,
            errorMsg: getRequestErrorMessage(err),
          }),
        ),
      );
  };
}
