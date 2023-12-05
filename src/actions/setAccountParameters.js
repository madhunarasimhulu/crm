const type = 'SET_ACCOUNT_PARAMETERS';

const setAccountParameters = (payload) => ({
  type,
  payload,
});

export { type };
export default setAccountParameters;
