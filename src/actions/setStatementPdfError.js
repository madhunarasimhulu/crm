const type = 'SET_STATEMENT_PDF_ERROR';

const setStatementPdfError = (data = {}) => ({
  data,
  type,
});

export { type };
export default setStatementPdfError;
