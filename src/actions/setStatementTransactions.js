const type = 'SET_STATEMENT_TRANSACTIONS';

const setStatementTransactions = (data = {}) => ({
  data,
  type,
});

export { type };
export default setStatementTransactions;
