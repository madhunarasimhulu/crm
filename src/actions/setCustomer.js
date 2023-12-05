const type = 'SET_CUSTOMER';

const setCustomer = (data = {}) => ({
  data,
  type,
});

export { type };
export default setCustomer;
