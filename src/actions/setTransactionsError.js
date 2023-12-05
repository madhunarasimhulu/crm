const type = 'SET_TRANSACTIONS_ERROR';

const setTransactionsError = (data = {}) => ({
  data,
  type,
});

export { type };
export default setTransactionsError;
