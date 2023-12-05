const type = 'SET_SERVICE_REQUESTS_ERROR';

const setServiceRequestsError = (data = {}) => ({
  data,
  type,
});

export { type };
export default setServiceRequestsError;
