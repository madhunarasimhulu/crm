const type = 'SEARCH_BY_CARD_NUMBER';

const setSearchByCard = (value = '') => ({
  value,
  type,
});

export { type };
export default setSearchByCard;
