import { BankAccounts } from '../clients';
import { getRequestErrorMessage } from '../utils';
import {
  setTimelineEventsToPrePaid,
  setTimelineEventsToPrePaidError,
  setTimelineEventsToPrePaidLoading,
  setTimelineEvents,
  setTimelineEventsError,
  setTimelineEventsLoading,
} from '.';

export default function getTimelineEventsToPrePaid({
  shouldStartLoading,
  credentials,
  bankAccount,
  startDate,
  endDate,
  afterId,
  clearUrl,
  type,
  timelineSrc,
}) {
  return (dispatch) => {
    if (timelineSrc) dispatch(setTimelineEventsLoading(shouldStartLoading));
    else dispatch(setTimelineEventsToPrePaidLoading(shouldStartLoading));

    const startDateIso = startDate
      ? new Date(startDate.setHours(0, 0, 0)).toISOString()
      : '';
    const endDateIso = endDate
      ? new Date(endDate.setHours(23, 59, 59)).toISOString()
      : '';

    return BankAccounts.getTimelineEventsByBankAccount(
      credentials,
      bankAccount,
      startDateIso,
      endDateIso,
      afterId,
      type,
    )
      .then((data) => {
        if (timelineSrc) {
          dispatch(setTimelineEvents(data));
        } else {
          dispatch(
            setTimelineEventsToPrePaid({
              ...data,
              error: false,
              start: startDate,
              end: endDate,
              clearUrl,
            }),
          );
        }
      })
      .catch((err) => {
        if (timelineSrc) {
          dispatch(
            setTimelineEventsError({
              error: true,
              errorMsg: getRequestErrorMessage(err),
            }),
          );
        } else {
          dispatch(
            setTimelineEventsToPrePaidError({
              error: true,
              errorMsg: getRequestErrorMessage(err),
              start: startDate,
              end: endDate,
            }),
          );
        }
      });
  };
}
