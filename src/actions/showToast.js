const type = 'SHOW_TOAST';

const showToast = (data) => ({
  data,
  type,
});

export { type };
export default showToast;
