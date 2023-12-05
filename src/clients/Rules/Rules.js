import axios from 'axios';
import setup, { clearCacheMiddleware } from '../setup';
import {
  getBaseAPIURL,
  mount42csAuthHeaders,
  mountPismoAuthHeaders,
} from '../../utils';
import { v4 as uuidv4 } from 'uuid';
import {
  INTERNATIONAL,
  INTL_ATM_SPEND_LIMIT,
  INTL_ECOM_SPEND_LIMIT,
  INTL_NFC_SPEND_LIMIT,
  INTL_POS_SPEND_LIMIT,
} from 'components/CustomerSpendingLimits/CustomerSpendingLimitsChannel.utils';
const REACT_APP_42CS_AUTH_URL = process.env.REACT_APP_42CS_AUTH_URL;

const client42CSFlex = setup(
  axios.create({
    baseURL: `${REACT_APP_42CS_AUTH_URL}`,
  }),
);

const getChannelName = (channel, type) => {
  if (type === 'restriction') return `${channel.toUpperCase()}_RESTRICTION`;
  if (type === 'limit_value') return `${channel.toUpperCase()}_LIMIT_VALUE`;
};

const hasSpendingLimitByKeyName = (channel, type, nameSpending) => {
  const name = String(nameSpending).split('|');
  if (
    typeof name[0] !== 'undefined' &&
    name[0] === getChannelName(channel, type)
  )
    return true;
  return false;
};

const makeKeyName = (channel, type) => {
  const tracking_id = uuidv4();
  return `${getChannelName(channel, type)}|${tracking_id}`;
};

const makeCondition = (attribute, operator, value) => {
  return {
    attribute,
    operator,
    value,
  };
};

const makeRestriction = (channel, entry_mode, processing_codes, mcc) => {
  const nameSpendingLimitKey = makeKeyName(channel, 'restriction');
  const conditions = [];

  if (entry_mode) {
    conditions.push(
      makeCondition(
        'entry_mode',
        Array.isArray(entry_mode) ? 'in' : 'eq',
        Array.isArray(entry_mode) ? entry_mode.join(',') : entry_mode,
      ),
    );
  }

  if (mcc) {
    conditions.push(makeCondition('merchant_category_code', 'eq', mcc));
  }

  return {
    type: 'restriction',
    name: nameSpendingLimitKey,
    processing_codes: processing_codes?.length > 0 ? processing_codes : [],
    conditions: conditions,
    deny_code: `${channel.toUpperCase()}_NOT_ALLOWED`,
    active: true,
  };
};

const makeIntlRestriction = (
  channel,
  entry_mode,
  processing_codes,
  mcc,
  mccin,
) => {
  const nameSpendingLimitKey = makeKeyName(channel, 'restriction');
  const conditions = [];

  if (entry_mode) {
    conditions.push(
      makeCondition(
        'entry_mode',
        Array.isArray(entry_mode) ? 'in' : 'eq',
        Array.isArray(entry_mode) ? entry_mode.join(',') : entry_mode,
      ),
    );
  }

  if (mcc) {
    conditions.push(makeCondition('merchant_category_code', 'eq', mcc));
  }

  if (mccin) {
    conditions.push(
      makeCondition(
        'merchant_category_code',
        'in',
        Array.isArray(mccin) ? mccin.join(',') : mccin,
      ),
    );
  }

  return {
    type: 'restriction',
    name: nameSpendingLimitKey,
    processing_codes: processing_codes?.length > 0 ? processing_codes : [],
    conditions: conditions,
    deny_code: `${channel.toUpperCase()}_NOT_ALLOWED`,
    active: true,
  };
};

const makeLimitValue = (channel, value, entry_mode, processing_codes, mcc) => {
  const nameSpendingLimitKey = makeKeyName(channel, 'limit_value');

  const conditions = [];

  if (entry_mode) {
    conditions.push(
      makeCondition(
        'entry_mode',
        Array.isArray(entry_mode) ? 'in' : 'eq',
        Array.isArray(entry_mode) ? entry_mode.join(',') : entry_mode,
      ),
    );
  }

  if (mcc) {
    conditions.push(makeCondition('merchant_category_code', 'eq', mcc));
  }

  conditions.push(makeCondition('amount', 'gt', String(value * 100)));

  return {
    type: 'restriction',
    name: nameSpendingLimitKey,
    processing_codes: processing_codes?.length > 0 ? processing_codes : [],
    conditions: conditions,
    deny_code: `${channel.toUpperCase()}_LIMIT_EXCEDED`,
    active: true,
  };
};

const makeLimitValueAccumulated = (
  channel,
  value,
  entry_mode,
  processing_codes,
  mcc,
  reset_day_month,
  mccin,
) => {
  const nameSpendingLimitKey = makeKeyName(channel, 'limit_value');
  const valuePersed = Math.ceil(value * 100);

  const conditions = [];

  if (entry_mode) {
    conditions.push(
      makeCondition(
        'entry_mode',
        Array.isArray(entry_mode) ? 'in' : 'eq',
        Array.isArray(entry_mode) ? entry_mode.join(',') : entry_mode,
      ),
    );
  }

  if (mcc) {
    conditions.push(makeCondition('merchant_category_code', 'eq', mcc));
  }

  if (mccin) {
    conditions.push(
      makeCondition(
        'merchant_category_code',
        'in',
        Array.isArray(mccin) ? mccin.join(',') : mccin,
      ),
    );
  }

  return {
    type: 'spending_limit',
    name: nameSpendingLimitKey,
    processing_codes: processing_codes?.length > 0 ? processing_codes : [],
    conditions: conditions,
    limit_duration: 'P1M',
    reset_period: {
      month_day: reset_day_month ? Number(reset_day_month) : null,
    },
    max_limit: valuePersed,
    deny_code: `${channel.toUpperCase()}_LIMIT_EXCEDED`,
    active: true,
  };
};

const makeRestrictionByChannel = (
  channel,
  type,
  max_limit,
  reset_day_month,
) => {
  if (channel === 'ecommerce') {
    if (type === 'restriction')
      return makeRestriction(channel, ['0100', '0120'], ['00', '003100']);
    if (type === 'limit_value')
      return makeLimitValueAccumulated(
        channel,
        max_limit,
        ['0100', '0120', '1000'],
        ['00', '003100'],
        null,
        reset_day_month,
      );
  }

  if (channel === 'pos_chip') {
    if (type === 'restriction')
      return makeRestriction(channel, ['0510', '9000'], ['00', '003100']);
    if (type === 'limit_value')
      return makeLimitValueAccumulated(
        channel,
        max_limit,
        ['0510', '9000'],
        ['00', '003100'],
        null,
        reset_day_month,
      );
  }

  if (channel === 'pos_nfc') {
    if (type === 'restriction')
      return makeRestriction(channel, '0710', ['00', '003100']);
    if (type === 'limit_value')
      return makeLimitValue(channel, max_limit, '0710', ['00', '003100']);
  }

  if (channel === 'atm') {
    if (type === 'restriction')
      return makeRestriction(channel, null, null, '6011');
    if (type === 'limit_value')
      return makeLimitValueAccumulated(
        channel,
        max_limit,
        null,
        null,
        '6011',
        reset_day_month,
      );
  }

  if (channel === INTERNATIONAL) {
    if (type === 'restriction')
      return makeRestriction(channel, null, ['003100']);
    if (type === 'limit_value')
      return makeLimitValueAccumulated(
        channel,
        max_limit,
        null,
        ['003100'],
        null,
        reset_day_month,
      );
  }

  if (channel === INTL_ECOM_SPEND_LIMIT) {
    if (type === 'restriction')
      return makeIntlRestriction(channel, ['011', '012', '811'], ['013100']);
    if (type === 'limit_value')
      return makeLimitValueAccumulated(
        channel,
        max_limit,
        ['011', '012', '811', '1000'],
        ['013100'],
        null,
        reset_day_month,
      );
  }
  if (channel === INTL_POS_SPEND_LIMIT) {
    if (type === 'restriction')
      return makeIntlRestriction(
        channel,
        ['901', '902', '051', '052'],
        ['003100'],
      );
    if (type === 'limit_value')
      return makeLimitValueAccumulated(
        channel,
        max_limit,
        ['901', '902', '051', '052'],
        ['003100'],
        null,
        reset_day_month,
      );
  }

  if (channel === INTL_NFC_SPEND_LIMIT) {
    if (type === 'restriction')
      return makeRestriction(channel, ['901', '902', '071', '072'], ['003100']);
    if (type === 'limit_value')
      return makeLimitValue(
        channel,
        max_limit,
        ['901', '902', '071', '072'],
        ['003100'],
        null,
      );
  }

  if (channel === INTL_ATM_SPEND_LIMIT) {
    if (type === 'restriction')
      return makeIntlRestriction(channel, null, ['013100'], null, [
        '6010',
        '6011',
      ]);
    if (type === 'limit_value')
      return makeLimitValueAccumulated(
        channel,
        max_limit,
        null,
        ['013100'],
        null,
        reset_day_month,
        ['6010', '6011'],
      );
  }
};

class Rules {
  static getSpendingLimits(credentials = {}) {
    return new Promise((resolve, reject) => {
      client42CSFlex
        .get(`/flex-control/v1/list`, {
          headers: mount42csAuthHeaders(credentials),
        })
        .then(clearCacheMiddleware(client42CSFlex))
        .then(resolve)
        .catch((err) => {
          return reject(err);
        });
    });
  }

  static addSpendingLimitRestriction(credentials, spendingLimitId) {
    return new Promise((resolve, reject) => {
      if (
        spendingLimitId != '' &&
        spendingLimitId != null &&
        spendingLimitId != undefined
      ) {
        client42CSFlex
          .patch(
            `/flex-control/v1/update/${spendingLimitId}`,
            {
              active: true,
              customized: true,
            },
            {
              headers: mount42csAuthHeaders(credentials),
            },
          )
          .then(resolve)
          .catch(reject);
      } else {
        return reject({
          response: { errorMsg: 'Spending limit not found' },
        });
      }
    });
  }

  static addSpendingLimitIntlRestriction(
    channel,
    credentials,
    spendingLimitId,
  ) {
    if (
      spendingLimitId != '' &&
      spendingLimitId != null &&
      spendingLimitId != undefined
    ) {
      return new Promise((resolve, reject) => {
        client42CSFlex
          .patch(
            `/flex-control/v1/update/${spendingLimitId}`,
            {
              active: true,
              customized: true,
            },
            {
              headers: mount42csAuthHeaders(credentials),
            },
          )
          .then(resolve)
          .catch(reject);
      });
    } else {
      return new Promise((resolve, reject) => {
        const data = makeRestrictionByChannel(channel, 'restriction');
        client42CSFlex
          .post(`/flex-control/v1/create`, data, {
            headers: mount42csAuthHeaders(credentials),
          })
          .then(resolve)
          .catch(reject);
      });
    }
  }

  static removeSpendingLimitRestriction(restrictionId, credentials = {}) {
    return new Promise((resolve, reject) => {
      if (
        restrictionId != null &&
        restrictionId != '' &&
        restrictionId != undefined
      ) {
        client42CSFlex
          .patch(
            `/flex-control/v1/update/${restrictionId}`,
            {
              active: false,
              customized: true,
            },
            {
              headers: mount42csAuthHeaders(credentials),
            },
          )
          .then(resolve)
          .catch(reject);
      } else {
        return reject({
          response: { errorMsg: 'Spending limit not found' },
        });
      }
    });
  }

  static addSpendingLimitValue(
    channel,
    max_limit,
    day_reset,
    credentials = {},
    SpendLimitValId,
  ) {
    if (
      SpendLimitValId != null &&
      SpendLimitValId != '' &&
      SpendLimitValId != undefined
    ) {
      return new Promise((resolve, reject) => {
        const data = makeRestrictionByChannel(
          channel,
          'limit_value',
          max_limit,
          day_reset,
        );
        delete data.type;
        delete data.reset_period;
        delete data.limit_duration;
        delete data.processing_codes;
        delete data.name;
        delete data.deny_code;

        client42CSFlex
          .patch(`/flex-control/v1/update/${SpendLimitValId}`, data, {
            headers: mount42csAuthHeaders(credentials),
          })
          .then(resolve)
          .catch(reject);
      });
    } else {
      return new Promise((resolve, reject) => {
        const data = makeRestrictionByChannel(
          channel,
          'limit_value',
          max_limit,
          day_reset,
        );

        client42CSFlex
          .post(`/flex-control/v1/create`, data, {
            headers: mount42csAuthHeaders(credentials),
          })
          .then(resolve)
          .catch(reject);
      });
    }
  }

  static deactivatePreviousflexchannelsDomestic(flexId, credentials) {
    return new Promise((resolve, reject) => {
      const data = {
        active: false,
        customized: true,
      };
      client42CSFlex
        .patch(`/flex-control/v1/update/${flexId}`, data, {
          headers: mount42csAuthHeaders(credentials),
        })
        .then(resolve)
        .catch(reject);
    });
  }

  static deactivatePreviousSpendingLimitValues(
    channel,
    credentials = {},
    SpendLimitValId,
  ) {
    if (
      SpendLimitValId != null &&
      SpendLimitValId != undefined &&
      SpendLimitValId != ''
    ) {
      return new Promise((resolve, reject) => {
        const data = {
          active: false,
          customized: true,
        };
        client42CSFlex
          .patch(`/flex-control/v1/update/${SpendLimitValId}`, data, {
            headers: mount42csAuthHeaders(credentials),
          })
          .then(resolve)
          .catch(reject);
      });
    }
  }

  static getCustomerSpendingLimitControls(customerId, credentials = {}) {
    return new Promise((resolve, reject) => {
      client42CSFlex
        .get(`/flex-control/v1/customer/${customerId}`, {
          headers: mount42csAuthHeaders(credentials),
        })
        .then(clearCacheMiddleware(client42CSFlex))
        .then(resolve)
        .catch((err) => {
          return reject(err);
        });
    });
  }

  static createCustomerSpendingLimitControl(
    data,
    customerId,
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      client42CSFlex
        .post(`/flex-control/v1/customer/${customerId}`, data, {
          headers: mount42csAuthHeaders(credentials),
        })
        .then(clearCacheMiddleware(client42CSFlex))
        .then(resolve)
        .catch((err) => {
          return reject(err);
        });
    });
  }

  static updateCustomerSpendingLimitControl(
    data,
    customerId,
    flexId,
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      client42CSFlex
        .patch(`/flex-control/v1/customer/${customerId}/${flexId}`, data, {
          headers: mount42csAuthHeaders(credentials),
        })
        .then(clearCacheMiddleware(client42CSFlex))
        .then(resolve)
        .catch((err) => {
          return reject(err);
        });
    });
  }

  static getSingleCustomerSpendingLimitControl(
    customerId,
    flexId,
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      client42CSFlex
        .patch(`/flex-control/v1/customer/${customerId}/${flexId}`, {
          headers: mount42csAuthHeaders(credentials),
        })
        .then(clearCacheMiddleware(client42CSFlex))
        .then(resolve)
        .catch((err) => {
          return reject(err);
        });
    });
  }

  static updateResetDatetoDueDate(flexId, credentials, dueDate) {
    return new Promise((resolve, reject) => {
      const data = {
        reset_period: {
          month_day: dueDate ? Number(dueDate) : null,
        },
      };
      client42CSFlex
        .patch(`/flex-control/v1/update/${flexId}`, data, {
          headers: mount42csAuthHeaders(credentials),
        })
        .then(resolve)
        .catch(reject);
    });
  }

  static updateSupplementaryResetDatetoDueDate(
    data,
    customerId,
    flexId,
    credentials = {},
  ) {
    return new Promise((resolve, reject) => {
      client42CSFlex
        .patch(`/flex-control/v1/customer/${customerId}/${flexId}`, data, {
          headers: mount42csAuthHeaders(credentials),
        })
        .then(clearCacheMiddleware(client42CSFlex))
        .then(resolve)
        .catch((err) => {});
    });
  }
}

export { client42CSFlex, hasSpendingLimitByKeyName };
export default Rules;
