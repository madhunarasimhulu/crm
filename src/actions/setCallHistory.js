const type = 'SET_CALL_HISTORY';

const setCallHistory = (data = []) => ({
  data,
  type,
});

export { type };
export default setCallHistory;
