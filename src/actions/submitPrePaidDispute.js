import { PrePaidDispute } from '../clients';
import { setPrePaidDisputeSubmitting } from '.';

const submitPrePaidDispute =
  (
    authorization_id,
    modality,
    comment,
    protocol,
    credentials,
    timeline,
    disputed_amount,
  ) =>
  (dispatch) => {
    dispatch(setPrePaidDisputeSubmitting(true));
    const serializedComment = JSON.stringify(comment);
    const serializedTimeline = JSON.stringify(timeline);
    return PrePaidDispute.createPrePaidDispute(
      authorization_id,
      modality,
      serializedComment,
      protocol,
      credentials,
      serializedTimeline,
      disputed_amount,
    );
  };

export default submitPrePaidDispute;
