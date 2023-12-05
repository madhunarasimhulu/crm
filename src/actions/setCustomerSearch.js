const type = 'SET_CUSTOMER_SEARCH';

const setCustomerSearch = (value = '') => ({
  value,
  type,
});

export { type };
export default setCustomerSearch;
