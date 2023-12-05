const type = 'SET_TRANSACTION_ERROR';

const setTransactionError = (data = {}) => ({
  data,
  type,
});

export { type };
export default setTransactionError;
