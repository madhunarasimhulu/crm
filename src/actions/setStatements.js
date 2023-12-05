const type = 'SET_STATEMENTS';

const setStatements = (data = []) => ({
  data,
  type,
});

export { type };
export default setStatements;
