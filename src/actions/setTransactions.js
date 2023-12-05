const type = 'SET_TRANSACTIONS';

const setTransactions = (data = {}) => ({
  data,
  type,
});

export { type };
export default setTransactions;
