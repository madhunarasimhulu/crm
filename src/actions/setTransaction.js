const type = 'SET_TRANSACTION';

const setTransaction = (data = {}) => ({
  data,
  type,
});

export { type };
export default setTransaction;
