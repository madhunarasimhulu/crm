const type = 'SET_CUSTOMER_SEARCH_RESULTS';

const setCustomerSearchResults = (data = []) => ({
  data,
  type,
});

export { type };
export default setCustomerSearchResults;
