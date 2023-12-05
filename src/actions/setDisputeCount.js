const type = 'SET_DISPUTE_COUNT';

const setDisputeCount = (data = {}) => ({
  data,
  type,
});

export { type };
export default setDisputeCount;
