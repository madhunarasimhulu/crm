const type = 'UPDATE_TRANSACTION';

const updateTransaction = (data = {}) => ({
  data,
  type,
});

export { type };
export default updateTransaction;
