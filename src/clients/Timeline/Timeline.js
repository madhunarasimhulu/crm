import axios from 'axios';
import setup from '../setup';
import { getBaseAPIURL } from 'utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/timeline`,
  }),
);

export default client;
