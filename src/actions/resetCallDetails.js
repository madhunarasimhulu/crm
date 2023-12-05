const type = 'RESET_CALL_DETAILS';

const resetCallDetails = (data = {}) => ({
  data,
  type,
});

export { type };
export default resetCallDetails;
