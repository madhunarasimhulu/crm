const type = 'SET_LIMIT_PROPOSAL_REASON';

const setLimitProposalReason = (data = '') => ({
  data,
  type,
});

export { type };
export default setLimitProposalReason;
