const type = 'SET_TOTAL_DUE';

const setTotalDue = (data = {}) => ({
  data,
  type,
});

export { type };
export default setTotalDue;
