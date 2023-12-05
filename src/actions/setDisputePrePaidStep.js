const type = 'SET_DISPUTE_PRE_PAID_STEP';

const setDisputePrePaidStep = (step = 0) => ({
  type,
  step,
});

export { type };
export default setDisputePrePaidStep;
