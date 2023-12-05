import { Orgs } from '../clients/Orgs';
import { setPid } from './setPid';
import { setPidLoading } from './setPidLoading';

export const getPid =
  ({ credentials }) =>
  (dispatch) => {
    dispatch(setPidLoading(true));
    return Orgs.getPid({ credentials })
      .then((data) => dispatch(setPid(data)))
      .catch((error) => {
        throw error;
      })
      .finally(() => dispatch(setPidLoading(false)));
  };
