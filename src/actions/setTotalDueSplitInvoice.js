const type = 'SET_TOTAL_DUE_SPLIT_INVOICE';

const setTotalDueSplitInvoice = (data = {}) => ({
  data,
  type,
});

export { type };
export default setTotalDueSplitInvoice;
