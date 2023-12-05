const type = 'SET_CUSTOMER_LATEST_TRANSACTIONS';

const setCustomerLatestAuthorizations = (data = {}) => ({
  data,
  type,
});

export { type };
export default setCustomerLatestAuthorizations;
