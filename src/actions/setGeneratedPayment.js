const type = 'SET_GENERATED_PAYMENT';

const setGeneratedPayment = (data) => ({
  data,
  type,
});

export { type };
export default setGeneratedPayment;
