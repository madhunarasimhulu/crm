const type = 'SET_DISPUTE_TREE_LOADING';

const setDisputeTreeLoading = (data = false) => ({
  data,
  type,
});

export { type };
export default setDisputeTreeLoading;
