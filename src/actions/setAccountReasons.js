const type = 'SET_ACCOUNT_REASONS';

const setAccountReasons = (data = '') => ({
  data,
  type,
});

export { type };
export default setAccountReasons;
