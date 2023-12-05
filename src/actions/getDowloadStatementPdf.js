const type = 'DOWNLOAD_STATEMENT_PDF';

const getDownloadStatementPdf = (data = {}) => ({
  data,
  type,
});

export { type };
export default getDownloadStatementPdf;
