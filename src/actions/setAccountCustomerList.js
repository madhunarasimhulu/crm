const type = 'SET_ACCOUNT_CUSTOMER_LIST';

const setAccountCustomerList = (data = '') => ({
  data,
  type,
});

export { type };
export default setAccountCustomerList;
