const type = 'SET_PRE_PAID_DISPUTE_SUBMITTING';

const setPrePaidDisputeSubmitting = (status = false) => ({
  type,
  status,
});

export { type };
export default setPrePaidDisputeSubmitting;
