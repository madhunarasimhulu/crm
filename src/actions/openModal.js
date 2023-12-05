const type = 'OPEN_MODAL';

const openModal = (value = 0) => ({
  type,
  value,
});

export { type };
export default openModal;
