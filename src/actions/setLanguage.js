const type = 'SET_LANGUAGE';

const setLanguage = (data = 'en') => ({
  data,
  type,
});

export { type };
export default setLanguage;
