import { getRequestErrorStatus } from '..';

const transformNotFound = (requestError) => {
  const status = getRequestErrorStatus(requestError);

  if (status !== 404) {
    throw requestError;
  }

  return {
    data: {},
  };
};

export default transformNotFound;
