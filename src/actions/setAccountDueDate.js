const type = 'SET_ACCOUNT_DUEDATES';

const setAccountDueDate = (data = '') => ({
  data,
  type,
});

export { type };
export default setAccountDueDate;
