import axios from 'axios';

let REACT_APP_API_URL = new URL(process.env.REACT_APP_API_URL);
let REACT_APP_PCI_API_URL = new URL(process.env.REACT_APP_PCI_API_URL);

let LOG_URLS = [
  String(REACT_APP_API_URL.host).toLowerCase(),
  String(REACT_APP_PCI_API_URL.host).toLowerCase(),
];

export const logNewWorkError = (response) => {
  // Validations
  const pismoURL = response?.request?.responseURL;
  if (!validateLogURL(pismoURL)) return;
  const document_number = sessionStorage.getItem('pismo-document-number');
  const request_method = response?.config?.method;
  const request_body = response?.config?.data;
  const request_time = new Date();
  const error = response?.request?.responseText;
  const error_http_status = response?.request?.status;
  const additional_info = response?.headers;
  let data = {
    request: pismoURL,
    document_number: document_number,
    request_method: request_method,
    request_body: String(request_body),
    request_time: request_time,
    error: error,
    error_http_status: error_http_status,
    additional_info: [additional_info],
  };
  let token = sessionStorage.getItem('pismo-passport-token');
  // Logging
  axios({
    method: 'POST',
    url: `${process.env.REACT_APP_42CS_AUTH_URL}/monitor/log/pismo`,
    data: { ...data },
    headers: { 'x-token': token },
  });
};

function validateLogURL(pismoURL) {
  if (!pismoURL) return false;
  let hostURL = new URL(pismoURL);
  return LOG_URLS.includes(String(hostURL.host).toLowerCase());
}
