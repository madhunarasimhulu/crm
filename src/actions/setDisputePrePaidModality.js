const type = 'SET_DISPUTE_PRE_PAID_MODALITY';

const setDisputePrePaidModality = (modality = '', keyMessage = '') => ({
  type,
  modality,
  keyMessage,
});

export { type };
export default setDisputePrePaidModality;
