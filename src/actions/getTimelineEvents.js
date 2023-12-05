import { Events } from '../clients';
import { getRequestErrorMessage } from '../utils';
import {
  setTimelineEvents,
  setTimelineEventsLoading,
  setTimelineEventsError,
} from '.';

let isRefresh = false;
let timelineData;
let prevAccountId;

export default function getTimelineEvents({
  pages,
  credentials,
  isCustomer,
  accountId,
  shouldStartLoading,
  isPrepaid = false,
  ClickTimlelineReload,
}) {
  return (dispatch) => {
    if (
      isRefresh &&
      ClickTimlelineReload != true &&
      prevAccountId === accountId
    ) {
      return dispatch(setTimelineEvents(timelineData));
    }
    dispatch(setTimelineEventsLoading(shouldStartLoading));

    const promise =
      isCustomer && !isPrepaid
        ? Events.getTimelineEvents(pages, credentials)
        : Events.getTimelineEventsByAccountId(pages, credentials, accountId);

    return promise
      .then((data) => {
        timelineData = data;
        dispatch(setTimelineEvents(data));
        isRefresh = true;
        prevAccountId = accountId;
        return timelineData;
      })
      .catch((err) =>
        dispatch(
          setTimelineEventsError({
            error: true,
            errorMsg: getRequestErrorMessage(err),
          }),
        ),
      );
  };
}
