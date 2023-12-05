import { Rules } from '../clients';
import { setSpendingLimitChannel, showToast } from '.';
import { hasSpendingLimitByKeyName } from 'clients/Rules/Rules';
import {
  INTERNATIONAL,
  INTL_ATM_SPEND_LIMIT,
  INTL_ECOM_SPEND_LIMIT,
  INTL_NFC_SPEND_LIMIT,
  INTL_POS_SPEND_LIMIT,
} from 'components/CustomerSpendingLimits/CustomerSpendingLimitsChannel.utils';

const findActiveRestriction = (type, channel, spendingLimits) => {
  return spendingLimits?.find((spendingLimit) => {
    return hasSpendingLimitByKeyName(channel, type, spendingLimit.id);
  });
};

const findActiveIntlRestrictionandLimitValue = (
  type,
  channel,
  spendingLimits,
) => {
  return spendingLimits?.filter((spendingLimit) => {
    return hasSpendingLimitByKeyName(channel, type, spendingLimit.name);
  });
};

const getSpendingLimits = (credentials) => async (dispatch) => {
  return await Rules.getSpendingLimits(credentials)
    .then(async (response) => {
      const restrictionEcommerce = findActiveRestriction(
        'restriction',
        'ecommerce',
        response.data,
      );
      const spendingLimitFilteredECOMValues =
        findActiveIntlRestrictionandLimitValue(
          'limit_value',
          'ecommerce',
          response.data,
        );
      const spendingLimitEcommerce =
        spendingLimitFilteredECOMValues[
          spendingLimitFilteredECOMValues?.length - 1
        ];
      //

      //atm filtered restrcition and limit values
      const restrictionATM = findActiveRestriction(
        'restriction',
        'atm',
        response.data,
      );
      const spendingLimitFilteredATMValues =
        findActiveIntlRestrictionandLimitValue(
          'limit_value',
          'atm',
          response.data,
        );

      const spendingLimitATM =
        spendingLimitFilteredATMValues[
          spendingLimitFilteredATMValues?.length - 1
        ];
      //

      //POS CHIP filtered restrcition and limit values
      const restrictionPOS_CHIP = findActiveRestriction(
        'restriction',
        'pos_chip',
        response.data,
      );
      const spendingLimitFilteredPOSCHIPValues =
        findActiveIntlRestrictionandLimitValue(
          'limit_value',
          'pos_chip',
          response.data,
        );

      const spendingLimitPOS_CHIP =
        spendingLimitFilteredPOSCHIPValues[
          spendingLimitFilteredPOSCHIPValues?.length - 1
        ];
      //

      //POS NFC filtered restrcition and limit values
      const restrictionPOS_NFC = findActiveRestriction(
        'restriction',
        'pos_nfc',
        response.data,
      );
      const spendingLimitFilteredPOS_NFCValues =
        findActiveIntlRestrictionandLimitValue(
          'limit_value',
          'pos_nfc',
          response.data,
        );

      const spendingLimitPOS_NFC =
        spendingLimitFilteredPOS_NFCValues[
          spendingLimitFilteredPOS_NFCValues?.length - 1
        ];
      //

      //Intl filtered restrcition and limit values
      const restrictionInternational = findActiveRestriction(
        'restriction',
        INTERNATIONAL,
        response.data,
      );
      const spendingLimitFilteredInternationalValues =
        findActiveIntlRestrictionandLimitValue(
          'limit_value',
          INTERNATIONAL,
          response.data,
        );
      const spendingLimitInternational =
        spendingLimitFilteredInternationalValues[
          spendingLimitFilteredInternationalValues?.length - 1
        ];
      //

      //Intl ecommerce filtered restrcition and limit values
      const FilteredRestrictionIntl_Ecom_spend_Limit =
        findActiveIntlRestrictionandLimitValue(
          'restriction',
          INTL_ECOM_SPEND_LIMIT,
          response.data,
        );
      const restrictionIntl_Ecom_spend_Limit =
        FilteredRestrictionIntl_Ecom_spend_Limit[
          FilteredRestrictionIntl_Ecom_spend_Limit?.length - 1
        ];
      const FilteredSpendingLimitIntl_Ecom_spend_Limit =
        findActiveIntlRestrictionandLimitValue(
          'limit_value',
          INTL_ECOM_SPEND_LIMIT,
          response.data,
        );
      const spendingLimitIntl_Ecom_spend_Limit =
        FilteredSpendingLimitIntl_Ecom_spend_Limit[
          FilteredSpendingLimitIntl_Ecom_spend_Limit?.length - 1
        ];

      //

      //Intl POS CHIP filtered restrcition and limit values
      const FiltereRrestrictionIntl_POS_spend_Limit =
        findActiveIntlRestrictionandLimitValue(
          'restriction',
          INTL_POS_SPEND_LIMIT,
          response.data,
        );
      const restrictionIntl_POS_spend_Limit =
        FiltereRrestrictionIntl_POS_spend_Limit[
          FiltereRrestrictionIntl_POS_spend_Limit?.length - 1
        ];

      const FilteredSpendingLimitIntl_POS_spend_Limit =
        findActiveIntlRestrictionandLimitValue(
          'limit_value',
          INTL_POS_SPEND_LIMIT,
          response.data,
        );
      const spendingLimitIntl_POS_spend_Limit =
        FilteredSpendingLimitIntl_POS_spend_Limit[
          FilteredSpendingLimitIntl_POS_spend_Limit?.length - 1
        ];
      //--------

      //Intl POS NFC filtered restrcition and limit values
      const FilteredRestrictionIntl_NFC_spend_Limit =
        findActiveIntlRestrictionandLimitValue(
          'restriction',
          INTL_NFC_SPEND_LIMIT,
          response.data,
        );
      const restrictionIntl_NFC_spend_Limit =
        FilteredRestrictionIntl_NFC_spend_Limit[
          FilteredRestrictionIntl_NFC_spend_Limit?.length - 1
        ];
      const FilteredSpendingLimitIntl_NFC_spend_Limit =
        findActiveIntlRestrictionandLimitValue(
          'limit_value',
          INTL_NFC_SPEND_LIMIT,
          response.data,
        );
      const spendingLimitIntl_NFC_spend_Limit =
        FilteredSpendingLimitIntl_NFC_spend_Limit[
          FilteredSpendingLimitIntl_NFC_spend_Limit?.length - 1
        ];
      //--------

      //Intl ATM filtered restrcition and limit values
      const FilteredRestrictionIntl_ATM_spend_Limit =
        findActiveIntlRestrictionandLimitValue(
          'restriction',
          INTL_ATM_SPEND_LIMIT,
          response.data,
        );
      const restrictionIntl_ATM_spend_Limit =
        FilteredRestrictionIntl_ATM_spend_Limit[
          FilteredRestrictionIntl_ATM_spend_Limit?.length - 1
        ];
      const FilteredSpendingLimitIntl_ATM_spend_Limit =
        findActiveIntlRestrictionandLimitValue(
          'limit_value',
          INTL_ATM_SPEND_LIMIT,
          response.data,
        );
      const spendingLimitIntl_ATM_spend_Limit =
        FilteredSpendingLimitIntl_ATM_spend_Limit[
          FilteredSpendingLimitIntl_ATM_spend_Limit?.length - 1
        ];

      const channelsList = [
        {
          channel: 'ecommerce',
        },
        {
          channel: 'pos_chip',
        },
        {
          channel: 'pos_nfc',
        },
        {
          channel: 'atm',
        },
      ];

      let channelArray = channelsList.map((channel) => {
        return response?.data.filter((spendingLimit) => {
          return (
            String(spendingLimit.name).split('|')[0] ===
              `${channel.channel.toUpperCase()}_LIMIT_VALUE` &&
            spendingLimit.active === true
          );
        });
      });

      dispatch(
        setSpendingLimitChannel({
          ecommerce: {
            restrictionId: restrictionEcommerce?.id,
            restrictionActivated: restrictionEcommerce?.active ? true : false,
            limitValue: spendingLimitEcommerce?.active
              ? spendingLimitEcommerce?.max_limit
              : 0,
            dateResetValue: spendingLimitEcommerce?.reset_datetime || null,
            spendlimitId: spendingLimitEcommerce?.id || null,
            NoChannelLimitSetLength:
              channelArray[0]?.length === 0 ? true : false,
          },
          pos_chip: {
            restrictionId: restrictionPOS_CHIP?.id,
            restrictionActivated: restrictionPOS_CHIP?.active ? true : false,
            limitValue: spendingLimitPOS_CHIP?.active
              ? spendingLimitPOS_CHIP?.max_limit
              : 0,
            dateResetValue: spendingLimitPOS_CHIP?.reset_datetime || null,
            spendlimitId: spendingLimitPOS_CHIP?.id || null,
            NoChannelLimitSetLength:
              channelArray[1]?.length === 0 ? true : false,
          },
          pos_nfc: {
            restrictionId: restrictionPOS_NFC?.id,
            restrictionActivated: restrictionPOS_NFC?.active ? true : false,
            limitValue: spendingLimitPOS_NFC?.active
              ? spendingLimitPOS_NFC?.conditions?.find(
                  (condition) => condition.attribute === 'amount',
                )?.value
              : 0,
            dateResetValue: spendingLimitPOS_NFC?.reset_datetime || null,
            spendlimitId: spendingLimitPOS_NFC?.id || null,
            NoChannelLimitSetLength:
              channelArray[2]?.length === 0 ? true : false,
          },
          atm: {
            restrictionId: restrictionATM?.id,
            restrictionActivated: restrictionATM?.active ? true : false,
            limitValue: spendingLimitATM?.active
              ? spendingLimitATM?.max_limit
              : 0,
            dateResetValue: spendingLimitATM?.reset_datetime || null,
            spendlimitId: spendingLimitATM?.id || null,
            NoChannelLimitSetLength:
              channelArray[3]?.length === 0 ? true : false,
          },
          [INTERNATIONAL]: {
            restrictionId: restrictionInternational?.id,
            restrictionActivated: restrictionInternational?.active
              ? true
              : false,
            limitValue: spendingLimitInternational?.active
              ? spendingLimitInternational?.max_limit
              : 0,
            dateResetValue: spendingLimitInternational?.reset_datetime || null,
            spendlimitId: spendingLimitInternational?.id || null,
          },
          [INTL_ECOM_SPEND_LIMIT]: {
            restrictionId: restrictionIntl_Ecom_spend_Limit?.id || null,
            restrictionActivated: restrictionIntl_Ecom_spend_Limit?.active
              ? true
              : false,

            limitValue: spendingLimitIntl_Ecom_spend_Limit?.active
              ? spendingLimitIntl_Ecom_spend_Limit?.max_limit
              : 0,
            dateResetValue:
              spendingLimitIntl_Ecom_spend_Limit?.reset_datetime || null,
            spendlimitId: spendingLimitIntl_Ecom_spend_Limit?.id || null,
          },
          [INTL_POS_SPEND_LIMIT]: {
            restrictionId: restrictionIntl_POS_spend_Limit?.id || null,
            restrictionActivated: restrictionIntl_POS_spend_Limit?.active
              ? true
              : false,
            limitValue: spendingLimitIntl_POS_spend_Limit?.active
              ? spendingLimitIntl_POS_spend_Limit?.max_limit
              : 0,
            dateResetValue:
              spendingLimitIntl_POS_spend_Limit?.reset_datetime || null,
            spendlimitId: spendingLimitIntl_POS_spend_Limit?.id || null,
          },
          [INTL_NFC_SPEND_LIMIT]: {
            restrictionId: restrictionIntl_NFC_spend_Limit?.id || null,
            restrictionActivated: restrictionIntl_NFC_spend_Limit?.active
              ? true
              : false,
            limitValue: spendingLimitIntl_NFC_spend_Limit?.active
              ? spendingLimitIntl_NFC_spend_Limit?.conditions?.find(
                  (condition) => condition.attribute === 'amount',
                )?.value
              : 0,
            dateResetValue:
              spendingLimitIntl_NFC_spend_Limit?.reset_datetime || null,
            spendlimitId: spendingLimitIntl_NFC_spend_Limit?.id || null,
          },
          [INTL_ATM_SPEND_LIMIT]: {
            restrictionId: restrictionIntl_ATM_spend_Limit?.id || null,
            restrictionActivated: restrictionIntl_ATM_spend_Limit?.active
              ? true
              : false,
            limitValue: spendingLimitIntl_ATM_spend_Limit?.active
              ? spendingLimitIntl_ATM_spend_Limit?.max_limit
              : 0,
            dateResetValue:
              spendingLimitIntl_ATM_spend_Limit?.reset_datetime || null,
            spendlimitId: spendingLimitIntl_ATM_spend_Limit?.id || null,
          },
        }),
      );
    })
    .catch((err) => {
      if (err?.response?.status === 404) {
        dispatch(
          showToast({
            message: err?.response?.data?.message || 'No Spending Limits Found',
            style: 'error',
          }),
        );
        window.location.href = `#/search/?d`;
      } else {
        dispatch(
          showToast({
            message: `Error retrieving spending limits data please try again`,
            style: 'error',
          }),
        );
        window.location.href = `#/search/?d`;
      }
    });
};

export default getSpendingLimits;
