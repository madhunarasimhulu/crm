const type = 'SET_LIMIT_PROPOSAL_OUTCOME';

const setLimitProposalOutcome = (data = '') => ({
  data,
  type,
});

export { type };
export default setLimitProposalOutcome;
