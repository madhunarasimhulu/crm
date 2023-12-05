import { Rules } from '../clients';
import {
  getNextStatement,
  getSpendingLimits,
  setSpendingLimitChannel,
  setSpendingLimitsLoading,
  showToast,
} from '.';
import { hasSpendingLimitByKeyName } from 'clients/Rules/Rules';
import {
  INTERNATIONAL,
  INTL_ATM_SPEND_LIMIT,
  INTL_ECOM_SPEND_LIMIT,
  INTL_NFC_SPEND_LIMIT,
  INTL_POS_SPEND_LIMIT,
} from 'components/CustomerSpendingLimits/CustomerSpendingLimitsChannel.utils';
import { createNewNote } from 'utils/coral/NotesUtil';
import { parse } from 'date-fns';

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

const getFormattedDate = (date) => {
  const newDate = `${String(date).substring(0, 10)}T12:00:00Z`.split('T');
  return parse(newDate, 'yyyy-MM-dd', new Date()).getDate();
};

const getSpendingLimitsOnLoad =
  (credentials, accountId) => async (dispatch) => {
    return await Rules.getSpendingLimits(credentials)
      .then(async (response) => {
        let flex_ctrls = response?.data;

        //ecommerce filtered restrcition and limit values
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
        //--------

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
        //-------

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
        //--------

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
        //--------

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
        //--------

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

        //--------

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
        //--------

        const channelsList = [
          {
            channel: 'ecommerce',
            SpendLimitValId: spendingLimitEcommerce?.id || null,
            restrictionId: restrictionEcommerce?.id || null,
          },
          {
            channel: 'pos_chip',
            SpendLimitValId: spendingLimitPOS_CHIP?.id || null,
            restrictionId: restrictionPOS_CHIP?.id || null,
          },
          {
            channel: 'pos_nfc',
            SpendLimitValId: spendingLimitPOS_NFC?.id || null,
            restrictionId: restrictionPOS_NFC?.id || null,
          },
          {
            channel: 'atm',
            SpendLimitValId: spendingLimitATM?.id || null,
            restrictionId: restrictionATM?.id || null,
          },
        ];
        let promises = [];
        let channelArray = [];
        channelsList.map((flexControl) => {
          flex_ctrls?.forEach((spendingLimit) => {
            if (
              hasSpendingLimitByKeyName(
                flexControl.channel,
                'limit_value',
                spendingLimit.name,
              ) &&
              spendingLimit.active === true
            ) {
              if (
                flexControl.SpendLimitValId != null &&
                flexControl.SpendLimitValId != '' &&
                flexControl.SpendLimitValId != undefined
              ) {
                if (spendingLimit.id !== flexControl.SpendLimitValId) {
                  promises.push({ flexId: spendingLimit.id });
                }
              }
            }
          });
        });
        channelsList.map((flexControl) => {
          flex_ctrls?.forEach((spendingLimit) => {
            if (
              hasSpendingLimitByKeyName(
                flexControl.channel,
                'restriction',
                spendingLimit.name,
              ) &&
              spendingLimit.active === true
            ) {
              if (
                flexControl.restrictionId != null &&
                flexControl.restrictionId !== '' &&
                flexControl.restrictionId !== undefined
              ) {
                if (spendingLimit.id !== flexControl.restrictionId) {
                  promises.push({ flexId: spendingLimit.id });
                }
              }
            }
          });
        });

        if (promises?.length > 0) {
          let promise_list = await Promise.all(
            promises?.map(async (flexControl) => {
              await Rules.deactivatePreviousflexchannelsDomestic(
                flexControl.flexId,
                credentials,
              ).catch((e) => {});
            }),
          );

          // ---------------flex-cleanup-notes-block---------------
          // Listing out the promisses
          // 1. if all API calls are success, Putting the note as Flex-Control Cleanup Done ,
          // 2. if some API calls are success and some get failed, then putting the note as "Flex Cleanup ==> Success:   10, Failed : 3",
          // 3. if all API calls are failed putting note as Flex Cleanup Failed.

          // Filtering the promise list
          let failed_promises_count = promise_list.filter(
            (x) => x === null,
          ).length;

          let success_promises_count =
            promise_list.length - failed_promises_count;

          let note = '';
          if (success_promises_count === promise_list.length)
            note = 'Flex-Control Cleanup Done';
          if (promise_list.length === failed_promises_count)
            note = 'Flex-Control Cleanup Failed';
          if (success_promises_count > 0 && failed_promises_count > 0)
            note = `Flex Cleanup ==> Success: ${success_promises_count}, Failed : ${failed_promises_count}`;

          if (note !== '') createNewNote({ newNote: note });

          // ---------------flex-cleanup-notes-block---------------

          let { data } = await Rules.getSpendingLimits(credentials).catch(
            (e) => {},
          );
          channelArray = channelsList.map((channel, i) => {
            return data?.filter((spendingLimit) => {
              return (
                String(spendingLimit.name).split('|')[0] ===
                  `${channel.channel.toUpperCase()}_LIMIT_VALUE` &&
                spendingLimit.active === true
              );
            });
          });
        } else {
          channelArray = channelsList.map((channel, i) => {
            return flex_ctrls?.filter((spendingLimit) => {
              return (
                String(spendingLimit.name).split('|')[0] ===
                  `${channel.channel.toUpperCase()}_LIMIT_VALUE` &&
                spendingLimit.active === true
              );
            });
          });
        }
        //--------

        const channelsListResetDate = [
          {
            channel: 'ecommerce',
            SpendLimitValId: spendingLimitEcommerce?.id || null,
            dateResetValue: getFormattedDate(
              spendingLimitEcommerce?.reset_datetime,
            ),
          },
          {
            channel: 'pos_chip',
            SpendLimitValId: spendingLimitPOS_CHIP?.id || null,
            dateResetValue: getFormattedDate(
              spendingLimitPOS_CHIP?.reset_datetime,
            ),
          },
          {
            channel: 'atm',
            SpendLimitValId: spendingLimitATM?.id || null,
            dateResetValue: getFormattedDate(spendingLimitATM?.reset_datetime),
          },
          {
            channel: 'international',
            SpendLimitValId: spendingLimitInternational?.id || null,
            dateResetValue: getFormattedDate(
              spendingLimitInternational?.reset_datetime,
            ),
          },
          {
            channel: 'intl_ecom_spend_limit',
            SpendLimitValId: spendingLimitIntl_Ecom_spend_Limit?.id || null,
            dateResetValue: getFormattedDate(
              spendingLimitIntl_Ecom_spend_Limit?.reset_datetime,
            ),
          },
          {
            channel: 'intl_pos_spend_limit',
            SpendLimitValId: spendingLimitIntl_POS_spend_Limit?.id || null,
            dateResetValue: getFormattedDate(
              spendingLimitIntl_POS_spend_Limit?.reset_datetime,
            ),
          },
          {
            channel: 'intl_atm_spend_limit',
            SpendLimitValId: spendingLimitIntl_ATM_spend_Limit?.id || null,
            dateResetValue: getFormattedDate(
              spendingLimitIntl_ATM_spend_Limit?.reset_datetime,
            ),
          },
        ];
        const dueDatesArray = [];

        channelsListResetDate.map((item) => {
          if (item.dateResetValue === 28) {
            dueDatesArray.push({
              channel: item.channel,
              spendingId: item.SpendLimitValId,
              date: item.dateResetValue,
            });
          }
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
              dateResetValue:
                spendingLimitInternational?.reset_datetime || null,
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

        if (dueDatesArray?.length > 0) {
          dispatch(getNextStatement(accountId, credentials)).then(
            async (data) => {
              const cycleDueDate = data?.due_date;
              let newDate = parse(
                cycleDueDate,
                'yyyy-MM-dd',
                new Date(),
              ).getDate();
              dueDatesArray.map(async (item) => {
                if (item.date != newDate) {
                  await Rules.updateResetDatetoDueDate(
                    item?.spendingId,
                    credentials,
                    newDate,
                  );
                }
              });
              setTimeout(() => {
                dispatch(getSpendingLimits());
              }, 500);
            },
          );
        }

        dispatch(setSpendingLimitsLoading(false));
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          dispatch(
            showToast({
              message:
                err?.response?.data?.message || 'No Spending Limits Found',
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
        dispatch(setSpendingLimitsLoading(false));
      });
  };

export default getSpendingLimitsOnLoad;
