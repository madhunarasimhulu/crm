const type = 'SET_PAYMENT_SPLIT_INVOICE';

const setPaymentSplitInvoice = (data = {}) => ({
  data,
  type,
});

export { type };
export default setPaymentSplitInvoice;
