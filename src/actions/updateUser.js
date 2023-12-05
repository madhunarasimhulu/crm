const type = 'UPDATE_USER';

const updateUser = (data = {}) => ({
  data,
  type,
});

export { type };
export default updateUser;
