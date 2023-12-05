const getRequestErrorMessage = (error) =>
  error &&
  error.response &&
  (error.response.message ||
    (error.response.data && error.response.data.message));

export default getRequestErrorMessage;
