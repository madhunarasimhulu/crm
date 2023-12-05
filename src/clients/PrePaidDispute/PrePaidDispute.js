import axios from 'axios';
import setup from '../setup';
import { getBaseAPIURL, mountPismoAuthHeaders } from '../../utils';

const baseURL = getBaseAPIURL();

const client = setup(
  axios.create({
    baseURL: `${baseURL}/disputes`,
  }),
);

class PrePaidDisputes {
  static async createPrePaidDispute(
    authorization_id,
    modality,
    comment,
    protocol,
    credentials = {},
    timeline,
    disputed_amount,
  ) {
    let response;
    try {
      const dataPost = {
        authorization_id,
        modality,
        comment,
        protocol,
        timeline,
      };
      if (disputed_amount) dataPost.disputed_amount = disputed_amount;

      response = await client.post(`/v1/authorization-disputes`, dataPost, {
        headers: mountPismoAuthHeaders(credentials),
      });
    } catch (err) {
      response = {
        data: err.response.data,
        error: true,
      };
    }

    return response;
  }

  static async getAccountDisputeParameters(
    accountId,
    beginDate,
    endDate,
    credentials = {},
  ) {
    let response;
    try {
      const params = {
        accountId,
        beginDate,
        endDate,
      };

      response = await client.get(`/v1/disputes/count`, {
        headers: mountPismoAuthHeaders(credentials),
        params,
      });
    } catch (err) {
      response = {
        data: err.response.data,
        error: true,
      };
    }

    return response;
  }
}

export { client };
export default PrePaidDisputes;
