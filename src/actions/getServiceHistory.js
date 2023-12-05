import { ServiceRequests } from '../clients';
import {
  setServiceRequestsLoading,
  setServiceHistory,
  setServiceRequestsError,
  showToast,
} from '.';

const getServiceHistory = (data) => (dispatch) => {
  dispatch(setServiceRequestsLoading(true));
  return ServiceRequests.getServiceHistory(data)
    .then((res) => {
      dispatch(setServiceHistory(res));
    })
    .catch((err) => {
      dispatch(
        showToast({
          message:
            err?.response?.data?.msg ||
            err?.response?.data?.message ||
            'Some thing went wrong ',
          style: 'error',
        }),
      );
      dispatch(
        setServiceRequestsError(
          err?.response?.data?.msg ||
            err?.response?.data?.message ||
            'Some thing went wrong ',
        ),
      );
      throw err;
    });
};

export default getServiceHistory;
