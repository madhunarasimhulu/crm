const type = 'SET_CARDS';

const setCards = (data = {}) => ({
  data,
  type,
});

export { type };
export default setCards;
