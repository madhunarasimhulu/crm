const type = 'OPEN_PAYMENT';

const openPayment = (data = {}) => ({
  data,
  type,
});

export { type };
export default openPayment;
