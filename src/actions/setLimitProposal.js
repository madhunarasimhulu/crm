const type = 'SET_LIMIT_PROPOSAL';

const setLimitProposal = (data = '') => ({
  data,
  type,
});

export { type };
export default setLimitProposal;
