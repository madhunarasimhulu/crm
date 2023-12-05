import { Statements } from '../clients';
import { getRequestErrorMessage } from '../utils';
// import { setStatementPdfError } from '.';
import getDownloadStatementPdf from './getDowloadStatementPdf';
import setStatementPdfError from './setStatementPdfError';

export default function getStatementPdf(data) {
  return (dispatch) =>
    Statements.downloadStatement(data)
      .then((data) => dispatch(getDownloadStatementPdf(data)))
      .catch((error) => {
        if (error.response.data.success === false) {
          dispatch(
            setStatementPdfError({
              error: true,
              errorMsg: getRequestErrorMessage(error),
            }),
          );
          dispatch(getDownloadStatementPdf(error.response.data));
        }
      });
}
