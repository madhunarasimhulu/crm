const type = 'SET_ACCOUNT_DETAILS';

const setAccountDetails = (data = '') => ({
  data,
  type,
});

export { type };
export default setAccountDetails;
