const type = 'SET_CUSTOMER_ONBOARD_DATA';

const setCustomerOnboardData = (data = {}) => ({
  data,
  type,
});

export { type };
export default setCustomerOnboardData;
