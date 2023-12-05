const type = 'SET_SELECTED_MONTH';

const setSelectedMonth = (data = {}) => ({
  data,
  type,
});

export { type };
export default setSelectedMonth;
