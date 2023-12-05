const type = 'SET_CANCEL_INVOICE_INSTALLMENT';

const setCancelInvoiceInstallment = (data = {}) => ({
  data,
  type,
});

export { type };
export default setCancelInvoiceInstallment;
