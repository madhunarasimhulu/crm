const type = 'SET_ACCOUNT_STATUS';

const setAccountStatus = (data = '') => ({
  data,
  type,
});

export { type };
export default setAccountStatus;
