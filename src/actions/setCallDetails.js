const type = 'SET_CALL_DETAILS';

const setCallDetails = (data = {}) => ({
  data,
  type,
});

export { type };
export default setCallDetails;
