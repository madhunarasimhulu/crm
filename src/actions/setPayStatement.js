const type = 'SET_PAY_STATEMENT';

const setPayStatement = (data = {}) => ({
  data,
  type,
});

export { type };
export default setPayStatement;
