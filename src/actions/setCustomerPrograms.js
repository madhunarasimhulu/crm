const type = 'SET_CUSTOMER_PROGRAMS';

const setCustomerPrograms = (data = []) => ({
  data,
  type,
});

export { type };
export default setCustomerPrograms;
