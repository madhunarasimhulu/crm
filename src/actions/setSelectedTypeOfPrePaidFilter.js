const type = 'SET_SELECTED_TYPE_OF_PRE_PAID_FILTER';

const setSelectedTypeOfPrePaidFilter = (data = 0) => ({
  type,
  data,
});

export { type };
export default setSelectedTypeOfPrePaidFilter;
