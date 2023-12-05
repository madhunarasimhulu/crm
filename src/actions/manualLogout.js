import clearAllCache from '../clients/clearAllCache';

const type = 'MANUAL_LOGOUT';

const manualLogout = () => (dispatch) => {
  clearAllCache();

  return dispatch({
    type,
  });
};

export { type };
export default manualLogout;
