import axios from 'axios';
import setup from '../setup';
import { getBaseAPIURL, mountPismoAuthHeaders, mapLimits } from '../../utils';

const baseURL = getBaseAPIURL();

const clientRules = setup(
  axios.create({
    baseURL: `${baseURL}/rules`,
  }),
);

const clientBankAccounts = setup(
  axios.create({
    baseURL: `${baseURL}/bankaccounts`,
  }),
);

const clientBankAccountsSec = setup(
  axios.create({
    baseURL: `${baseURL}/bankaccounts-sec`,
  }),
);

class BankAccounts {
  static getLimits({ accountId }, credentials = {}) {
    return clientRules
      .get(`/v2/bankaccounts/rules/${accountId}/limits`, {
        headers: {
          ...mountPismoAuthHeaders({
            token: credentials.token,
            tenant: credentials.tenant,
          }),
          'x-account-id': accountId,
        },
        params: {
          page: 1,
          perPage: 999,
        },
      })
      .then((res) => {
        if (!res || !res.data) {
          throw res;
        }

        return res;
      })
      .then((res) => res.data)
      .then(mapLimits);
  }

  static getAccountHolders(accountId, credentials = {}) {
    return clientBankAccounts
      .get(`/v2/account-holders/${accountId}`, {
        headers: mountPismoAuthHeaders({
          token: credentials.token,
          tenant: credentials.tenant,
        }),
      })
      .then((res) => {
        if (!res || !res.data) {
          throw res;
        }

        return res;
      })
      .then((res) => res.data);
  }

  static getBankAccountsByAccountId(credentials = {}, accountIds) {
    return clientBankAccounts
      .get(`/v1/bank-accounts?accountIds=${accountIds}`, {
        headers: mountPismoAuthHeaders({
          token: credentials.token,
          tenant: credentials.tenant,
        }),
      })
      .then((res) => {
        if (!res || !res.data) {
          throw res;
        }

        return res;
      })
      .then((res) => res.data);
  }

  static getTimelineEventsByBankAccount(
    credentials = {},
    bankAccount,
    beginDate,
    endDate,
    afterId,
    type,
  ) {
    const queryDateParams =
      beginDate && endDate
        ? `beginDate=${beginDate}&endDate=${endDate}`
        : false;
    const filterIdParams = afterId ? `afterId=${afterId}` : false;
    // TO-DO: There has to be a better way to get this string without this mess of ternarys
    const queryParams =
      queryDateParams && filterIdParams
        ? `&${queryDateParams}&${filterIdParams}`
        : queryDateParams && !filterIdParams
        ? `&${queryDateParams}`
        : !queryDateParams && filterIdParams
        ? `&${filterIdParams}`
        : '';

    const typeFor = type.length ? `type=${type}&` : ``;

    return clientBankAccounts
      .post(
        `v2/timeline/search?${typeFor}perPage=10${queryParams}`,
        {
          source_holder: { bankAccount },
        },
        {
          headers: mountPismoAuthHeaders({
            token: credentials.token,
            tenant: credentials.tenant,
          }),
        },
      )
      .then((res) => {
        if (!res || !res.data) {
          throw res;
        }

        return res;
      })
      .then((res) => res.data);
  }

  static getCancelAccountReasons(credentials = {}, bankAccount) {
    return clientBankAccountsSec
      .post(
        '/v1/account-cancellation',
        {
          source_holder: { bankAccount },
        },
        {
          headers: mountPismoAuthHeaders({
            token: credentials.token,
            tenant: credentials.tenant,
          }),
        },
      )
      .then((res) => {
        if (!res || !res.data) {
          throw res;
        }

        return res.data;
      });
  }

  static cancelAccount(credentials = {}, bankaccount, reasonId, description) {
    return clientBankAccountsSec
      .post(
        '/v1/account-cancellation',
        {
          source_holder: { bankaccount },
          reason_id: reasonId,
          description,
        },
        {
          headers: mountPismoAuthHeaders({
            token: credentials.token,
            tenant: credentials.tenant,
          }),
        },
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  }

  static changeAccountStatus(
    accountId,
    status,
    credentials,
    reason_id,
    description,
  ) {
    return this.getBankAccountsByAccountId(credentials, accountId).then(
      (bankInfo) => {
        const {
          bank,
          agency: branch,
          account_number,
          account_digit: check_digit,
        } = bankInfo[0];

        const bankaccount = { bank, branch, account_number, check_digit };
        if (status === 'JUDICIAL_BLOCK' || status === 'ACCOUNT_CANCELLATION')
          status = 'BLOCKED';
        return clientBankAccountsSec
          .post(
            '/v1/account-status-change',
            {
              source_holder: { bankaccount },
              status,
              reason_id,
              description,
            },
            {
              headers: mountPismoAuthHeaders({
                token: credentials.token,
                tenant: credentials.tenant,
              }),
            },
          )
          .then((res) => res.data)
          .catch((err) => ({
            error: true,
            status: err.response.status,
            message: err.response.data.message,
          }));
      },
    );
  }
}

export { clientRules, clientBankAccounts, clientBankAccountsSec };
export default BankAccounts;
