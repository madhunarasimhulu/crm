const type = 'SET_CARDS_FAILURE';

const setCardsFailure = (data = {}) => ({
  data,
  type,
});

export { type };
export default setCardsFailure;
