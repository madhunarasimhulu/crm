import { ServiceRequests } from 'clients';
import showToast from './showToast';
import { setServiceRequestsLoading, setServiceRequestsError } from '.';

const submitNewServiceRequest = (data) => (dispatch) => {
  dispatch(setServiceRequestsLoading(true));
  return ServiceRequests.submitNewServiceRequest(data)
    .then((data) => {
      dispatch(
        showToast({
          message: data?.servicerequestId
            ? `New service request is submitted successfully with request id ${data?.servicerequestId}`
            : 'New service request is submitted successfully',
          style: 'success',
        }),
      );
      dispatch(setServiceRequestsLoading(false));
      return data;
    })
    .catch((e) => {
      dispatch(
        showToast({
          message:
            e?.response?.data?.msg ||
            'New service request submission is failed',
          style: 'error',
        }),
      );
      dispatch(
        setServiceRequestsError(
          e?.response?.data?.msg || 'New service request submission is failed',
        ),
      );
    });
};

export default submitNewServiceRequest;
