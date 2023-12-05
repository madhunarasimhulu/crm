import { Events } from '../clients';
import { logError } from '../utils';
import { setCallEventsLoading, complementCallDetails } from '.';

const getCallEvents =
  (customerId, accountId, protocol, credentials, isCustomer) => (dispatch) => {
    dispatch(setCallEventsLoading(true));

    return Events.getCallEvents(
      customerId,
      accountId,
      protocol,
      credentials,
      isCustomer,
    )
      .then((data) => dispatch(complementCallDetails(data)))
      .catch(logError);
  };

export default getCallEvents;
