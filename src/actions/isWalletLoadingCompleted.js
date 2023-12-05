const type = 'SET_ISWALLETLOADINGCOMPETED_LOADING';

const isWalletLoadingCompleted = (data) => ({
  data,
  type,
});

export { type };
export default isWalletLoadingCompleted;
