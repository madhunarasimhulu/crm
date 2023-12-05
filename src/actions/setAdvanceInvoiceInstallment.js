const type = 'SET_ADVANCE_INVOICE_INSTALLMENT';

const setAdvanceInvoiceInstallment = (data = {}) => ({
  data,
  type,
});

export { type };
export default setAdvanceInvoiceInstallment;
