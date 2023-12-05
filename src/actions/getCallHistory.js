import { Events } from '../clients';
import { logError } from '../utils';
import {
  setCallHistoryLoading,
  setCallHistoryLoadingMore,
  setCallHistory,
} from '.';

const getCallHistory =
  (customerId, accountId, pagination, credentials) => (dispatch) => {
    if (pagination.page > 1) {
      dispatch(setCallHistoryLoadingMore(true));
    } else {
      dispatch(setCallHistoryLoading(true));
    }

    return Events.getCallHistory(customerId, accountId, pagination, credentials)
      .then((data) => {
        dispatch(setCallHistory(data));
        return data;
      })
      .catch(logError);
  };

export default getCallHistory;
