const type = 'SET_SELECTED_RESULT';

const setSelectedResult = (index = 0) => ({
  index,
  type,
});

export { type };
export default setSelectedResult;
