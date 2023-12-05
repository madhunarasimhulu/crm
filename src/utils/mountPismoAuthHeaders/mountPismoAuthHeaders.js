const mountPismoAuthHeaders = ({ token, tenant, protocol }) => {
  const passportToken = sessionStorage.getItem('pismo-passport-token');

  const headers = {
    Authorization: passportToken,
  };

  if (protocol) {
    headers['x-protocol'] = protocol;
  }

  return headers;
};

export default mountPismoAuthHeaders;
