const type = 'SET_SELECTED_TRANSACTION';

const setSelectedTransaction = (data = {}) => ({
  data,
  type,
});

export { type };
export default setSelectedTransaction;
