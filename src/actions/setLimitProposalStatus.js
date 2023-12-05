const type = 'SET_LIMIT_PROPOSAL_STATUS';

const setLimitProposalStatus = (data = {}) => ({
  data,
  type,
});

export { type };
export default setLimitProposalStatus;
