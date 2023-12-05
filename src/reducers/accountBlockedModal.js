const isAccountBlockedModalOpen = (state = false, action = {}) => {
  switch (action.type) {
    case 'OPEN_ACCOUNT_BLOCKED_MODAL':
      return true;
    case 'CLOSE_ACCOUNT_BLOCKED_MODAL':
      return false;
    default:
      return state;
  }
};

export default isAccountBlockedModalOpen;
