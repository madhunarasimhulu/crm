const mount42csAuthHeaders = ({ token, tenant, protocol }) => {
  const passportToken = sessionStorage.getItem('pismo-passport-token');

  const headers = {
    'x-token': passportToken,
  };

  if (protocol) {
    headers['x-protocol'] = protocol;
  }

  return headers;
};

export default mount42csAuthHeaders;
