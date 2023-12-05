const type = 'SET_CUSTOMER_DETAIL';

const setCustomerDetail = (data = {}) => ({
  data,
  type,
});

export { type };
export default setCustomerDetail;
