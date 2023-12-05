// if necessary, open a new protocol
export const openProtocolProxy = (
  onCall,
  currentProtocol,
  customerId,
  accountId,
  user,
  dispatch,
  openCustomerProtocol,
) =>
  new Promise((resolve, reject) => {
    if (user.isCustomer) {
      return resolve();
    }

    if (onCall) {
      return resolve(currentProtocol);
    }

    return dispatch(openCustomerProtocol(customerId, accountId, user))
      .then((newProtocol) => resolve(newProtocol))
      .catch(reject);
  });
