const getRequestErrorStatus = (error) =>
  error &&
  error.response &&
  (error.response.status || error.response.statusCode);

export default getRequestErrorStatus;
