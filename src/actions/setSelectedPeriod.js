const type = 'SET_SELECTED_PERIOD';

const setSelectedPeriod = (data = {}) => ({
  data,
  type,
});

export { type };
export default setSelectedPeriod;
