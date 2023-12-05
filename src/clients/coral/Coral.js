import { Auth } from 'aws-amplify';
import axios from 'axios';
import { getBaseAPIURL } from 'utils';
import { AdminGroups, TenantSwitchOverGroups } from 'utils/coral/TenantConfig';

const baseURL = process.env.REACT_APP_42CS_AUTH_URL;

const CoralAPI = axios.create({
  baseURL: `${baseURL}/crm/v1/`,
  timeout: 25000,
});

//Appending Authorization Header For Every Coral Request
CoralAPI.interceptors.request.use(async (config) => {
  //Getting JWT Token From Aws Amplify
  let session = await Auth.currentSession();
  let JWT = session?.accessToken?.jwtToken;
  //Getting JWT Token From Aws Amplify
  config.headers.Authorization = `Bearer ${JWT}`;
  let role = sessionStorage.getItem('role');
  if (AdminGroups.includes(role) || TenantSwitchOverGroups.includes(role))
    config.headers['x-client-id'] = localStorage.getItem('clientId');
  return config;
});

export default CoralAPI;
