const getRequestErrorMsg = (error) => {
  return (
    error?.response?.message ||
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    error?.message ||
    error?.msg
  );
};
export default getRequestErrorMsg;
