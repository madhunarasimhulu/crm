const type = 'SET_DISPUTE_PRE_PAID_COMMENT';

const setDisputePrePaidComment = (comment = {}) => ({
  type,
  comment,
});

export { type };
export default setDisputePrePaidComment;
