import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  getAccountCustomerList,
  getSpendingLimits,
  resetSpendingLimitChannels,
  setSpendingLimitChannel,
  setSpendingLimitsLoading,
  showToast,
} from 'actions';
import { Accounts, Rules } from 'clients';

import './CustomerSpendingLimits.scss';
import CustomerSpendingLimitChannel from './CustomerSpendingLimitChannel';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import {
  INTERNATIONAL,
  INTL_ATM_SPEND_LIMIT,
  INTL_ECOM_SPEND_LIMIT,
  INTL_NFC_SPEND_LIMIT,
  INTL_POS_SPEND_LIMIT,
} from './CustomerSpendingLimitsChannel.utils';
import InternationalToggleButton from 'components/IntenationalComponent/InternationalToggleButton';
import InternationalInput from 'components/IntenationalComponent/InternationalInput';
import InternationalOtpModal from './InternationalOtpModal';
import openInternationalOtp from 'actions/openInternationalOtp';
import getCustomerOnboardOtpData from 'actions/getCustomerOnboardOtp';
import setInternationalOtpData from 'actions/setInternationalOtpData';
import submitInternationalOtpData from 'actions/submitInternationalOtpData';
import closeInternationalOtp from 'actions/closeInternationalOtp';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import CustomerSpendingLimitIntlSubChannels from './CustomerSpendingLimitIntlSubChannels';
import { Button, Loader } from 'components/commons';
import clearOtpData from 'actions/clearOtpData';
import { useSelector } from 'react-redux';
import MasterSpendingLimitChannels from './MasterSpendingLimitChnnels/MasterSpendingLimitChannels';
import getRequestErrorMsg from 'utils/getRequestErrorMsg/getRequestErrorMsg';
import { modules } from 'utils/coral/Modules';

const CustomerSpendingLimits = ({
  spendingLimits: { channels, loading },
  customer,
  credentials,
  intl,
  dispatch,
  internationalOtp,
}) => {
  const {
    account: { status_reason_id, account_status },
    customerId,
    accountId,
  } = useSelector((state) => state.customer);
  const [ecommerceValue, setEcommerceValue] = useState(0);
  const [posChipValue, setPosChipValue] = useState(0);
  const [posNfcValue, setPosNfcValue] = useState(0);
  const [atmValue, setAtmValue] = useState(0);
  const [internationalValue, setInternationalValue] = useState(0);

  const [IntlEcommerceValue, setIntlEcommerceValue] = useState(0);
  const [IntlPosChipValue, setIntlPosChipValue] = useState(0);
  const [IntlNfcValue, setIntlNfcValue] = useState(0);
  const [IntlAtmValue, setIntlAtmValue] = useState(0);

  const [isIntlEcomRestriction, setIntlEcomRestriction] = useState(false);
  const [isIntlPosChipRestriction, setIntlPosChipRestriction] = useState(false);
  const [isIntlPosNfcRestriction, setIntlPosNfcRestriction] = useState(false);
  const [isIntlAtmRestriction, setIntlAtmRestriction] = useState(false);
  const [isCustomerListGetcall, setIsCustomerListGetcall] = useState(false);

  const [isIntlSubLoading, setIntlSubLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);

  const getCustomerListGetCall = () => {
    const accountId = sessionStorage.getItem('pismo-account-id');
    Accounts.getAccountCustomerList(accountId, credentials)
      .then((data) => {
        setCustomerList(data?.items);
      })
      .catch((error) => {
        setIsCustomerListGetcall(true);
        dispatch(
          showToast({
            message:
              error?.response?.status === 403
                ? 'Invalid Request with 403 while getting Customer List'
                : getRequestErrorMsg(error) || 'Unkown error occured',
            style: 'error',
          }),
        );
      });
  };

  // For Coral
  const [loggedInRole, setLoggedInRole] = useState(null);
  let canUpdateLimits =
    modules.SPEND_LIMIT_MODIFIY.roles.includes(loggedInRole);

  useEffect(() => {
    setLoggedInRole(sessionStorage.getItem('role'));
  }, []);

  useEffect(() => {
    getCustomerListGetCall();
    return () => {
      dispatch(resetSpendingLimitChannels());
    };
  }, []);

  const [otpError, setOtpError] = useState('');
  const [expandAccordion, setExpandAccordion] = useState(false);
  const [otpTriggerMsg, setOtpTriggerMsg] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    setClientId(localStorage.getItem('clientId'));
  }, []);

  const { isInternationalOtpOpen, otpdata } = internationalOtp;
  const MAX_LIMIT_TAKEN = 'maximum attempt taken';

  const dosEcomLimitValue = channels.ecommerce.limitValue / 100 || 0;
  const dosPosLimitValue = channels.pos_chip.limitValue / 100 || 0;
  const dosNfcLimitValue = channels.pos_nfc.limitValue / 100 || 0;
  const dosAtmLimitValue = channels.atm.limitValue / 100 || 0;

  const intlLimitValueGlobal = channels[INTERNATIONAL].limitValue / 100 || 0;
  const intlEcomLimitValueGlobal =
    channels[INTL_ECOM_SPEND_LIMIT].limitValue / 100 || 0;
  const intlPosLimitValueGlobal =
    channels[INTL_POS_SPEND_LIMIT].limitValue / 100 || 0;
  const intlNfcLimitValueGlobal =
    channels[INTL_NFC_SPEND_LIMIT].limitValue / 100 || 0;
  const intlAtmLimitValueGlobal =
    channels[INTL_ATM_SPEND_LIMIT].limitValue / 100 || 0;

  const isIntlEcomRestrictionGlobal =
    channels[INTL_ECOM_SPEND_LIMIT]?.restrictionActivated;
  const isIntlPosRestrictionGlobal =
    channels[INTL_POS_SPEND_LIMIT]?.restrictionActivated;
  const isIntlPosNfcRestrictionGlobal =
    channels[INTL_NFC_SPEND_LIMIT]?.restrictionActivated;
  const isIntlAtmRestrictionGlobal =
    channels[INTL_ATM_SPEND_LIMIT]?.restrictionActivated;

  useEffect(() => {
    setEcommerceValue(dosEcomLimitValue);
  }, [dosEcomLimitValue]);

  useEffect(() => {
    setPosChipValue(dosPosLimitValue);
  }, [dosPosLimitValue]);

  useEffect(() => {
    setPosNfcValue(dosNfcLimitValue);
  }, [dosNfcLimitValue]);

  useEffect(() => {
    setAtmValue(dosAtmLimitValue);
  }, [dosAtmLimitValue]);

  useEffect(() => {
    if (
      Math.max(
        intlEcomLimitValueGlobal,
        intlPosLimitValueGlobal,
        intlNfcLimitValueGlobal,
        intlAtmLimitValueGlobal,
      ) > intlLimitValueGlobal
    ) {
      runValidation();
    }
  }, [
    intlLimitValueGlobal,
    intlEcomLimitValueGlobal,
    intlPosLimitValueGlobal,
    intlNfcLimitValueGlobal,
    intlAtmLimitValueGlobal,
  ]);

  useEffect(() => {
    setInternationalValue(intlLimitValueGlobal);
  }, [intlLimitValueGlobal]);
  useEffect(() => {
    setIntlEcommerceValue(intlEcomLimitValueGlobal);
  }, [intlEcomLimitValueGlobal]);
  useEffect(
    () => setIntlPosChipValue(intlPosLimitValueGlobal),
    [intlPosLimitValueGlobal],
  );
  useEffect(
    () => setIntlNfcValue(intlNfcLimitValueGlobal),
    [intlNfcLimitValueGlobal],
  );
  useEffect(
    () => setIntlAtmValue(intlAtmLimitValueGlobal),
    [intlAtmLimitValueGlobal],
  );

  useEffect(() => {
    setIntlEcomRestriction(isIntlEcomRestrictionGlobal);
  }, [isIntlEcomRestrictionGlobal]);

  useEffect(() => {
    setIntlPosChipRestriction(isIntlPosRestrictionGlobal);
  }, [isIntlPosRestrictionGlobal]);
  useEffect(() => {
    setIntlPosNfcRestriction(isIntlPosNfcRestrictionGlobal);
  }, [isIntlPosNfcRestrictionGlobal]);
  useEffect(() => {
    setIntlAtmRestriction(isIntlAtmRestrictionGlobal);
  }, [isIntlAtmRestrictionGlobal]);

  const runValidation = () => {
    var IntlChannels = {
      INTL_ECOM_SPEND_LIMIT: intlEcomLimitValueGlobal,
      INTL_POS_SPEND_LIMIT: intlPosLimitValueGlobal,
      INTL_NFC_SPEND_LIMIT: intlNfcLimitValueGlobal,
      INTL_ATM_SPEND_LIMIT: intlAtmLimitValueGlobal,
    };
    var zeroChannels = [];
    //Setting International Subchannels To Zero
    Object.entries(IntlChannels).forEach(([channel, value]) => {
      if (value > intlLimitValueGlobal) zeroChannels.push(channel);
    });
    updateChannels(zeroChannels);
  };

  const updateChannels = async (zeroChannels) => {
    if (zeroChannels.length === 0) return;
    await Promise.all(
      zeroChannels.map(async (channel) => {
        const SpendLimitValId = channels[channel.toLowerCase()].spendlimitId;
        await Rules.deactivatePreviousSpendingLimitValues(
          channel,
          credentials,
          SpendLimitValId,
        );
      }),
    );
    //Get Call
    dispatch(getSpendingLimits(credentials));
  };

  const translate = (id) => intl.formatMessage({ id });

  const createRestriction = async (channel) => {
    try {
      const spendingLimitId = channels[channel].restrictionId;
      const SpendLimitValId = channels[channel].spendlimitId;
      const SpendLimitLimitValue = channels[channel].limitValue;

      const response = await Rules.addSpendingLimitRestriction(
        credentials,
        spendingLimitId,
      );
      if (response?.status === 201 || response?.status === 200) {
        if (channel === 'pos_nfc') {
          if (dosNfcLimitValue != 5000) {
            let value = 5000;
            await updateSpendingLimitValue(channel, value);
          }
        } else {
          if (SpendLimitLimitValue != 0) {
            await Rules.deactivatePreviousSpendingLimitValues(
              channel,
              credentials,
              SpendLimitValId,
            );
          }
        }
        await dispatch(
          setSpendingLimitChannel({
            [channel]: {
              ...channels[channel],
              restrictionId: response.data.id,
              restrictionActivated: true,
              spendlimitId: SpendLimitValId,
            },
          }),
        );
        // await dispatch(getSpendingLimits(customer?.accountId, credentials));
      }

      if (channel === 'ecommerce') {
        setEcommerceValue(0);
      }

      if (channel === 'pos_chip') {
        setPosChipValue(0);
      }

      // if (channel === 'pos_nfc') {
      //   setPosNfcValue(0);
      // }

      if (channel === 'atm') {
        setAtmValue(0);
      }
      dispatch(setSpendingLimitsLoading(false));
    } catch (error) {
      dispatch(setSpendingLimitsLoading(false));
      dispatch(
        showToast({
          message:
            error?.response?.status === 403
              ? 'Invalid Request with 403'
              : getRequestErrorMsg(error) ||
                error?.response?.errorMsg ||
                'Unkown error occured',
          style: 'error',
        }),
      );
    }
  };

  const removeRestriction = async (channel) => {
    try {
      const spendingLimitId = channels[channel].restrictionId;
      const SpendLimitValId = channels[channel].spendlimitId;
      if (channel === 'pos_nfc') {
        if (dosNfcLimitValue != 5000) {
          let value = 5000;
          await updateSpendingLimitValue(channel, value);
        }
      }
      const response = await Rules.removeSpendingLimitRestriction(
        spendingLimitId,
        credentials,
      );
      if (response?.status === 200) {
        await dispatch(
          setSpendingLimitChannel({
            [channel]: {
              ...channels[channel],
              restrictionId: spendingLimitId,
              restrictionActivated: false,
              spendlimitId: SpendLimitValId,
            },
          }),
        );

        dispatch(getSpendingLimits(credentials));
      }

      dispatch(setSpendingLimitsLoading(false));
    } catch (error) {
      dispatch(setSpendingLimitsLoading(false));
      dispatch(
        showToast({
          message:
            error?.response?.status === 403
              ? 'Invalid Request with 403'
              : getRequestErrorMsg(error) ||
                error?.response?.errorMsg ||
                'Unkown error occured',
          style: 'error',
        }),
      );
    }
  };

  const RBI_LIMIT_FOR_POS_NFC = Number(
    process.env.REACT_APP_RBI_LIMIT_FOR_POS_NFC,
  );
  const showPosNfcLimitMsg = () =>
    dispatch(
      showToast({
        message: `Contactless Limit is restricted to Rs ${RBI_LIMIT_FOR_POS_NFC} As per the RBI Guidelines`,
        style: 'error',
      }),
    );

  const createRestrictionIntl = async (channel) => {
    const channelsIntlSub = [
      INTERNATIONAL,
      INTL_ECOM_SPEND_LIMIT,
      INTL_POS_SPEND_LIMIT,
      INTL_NFC_SPEND_LIMIT,
      INTL_ATM_SPEND_LIMIT,
    ];
    try {
      if (channel === INTERNATIONAL) {
        const loopres = channelsIntlSub.map(async (channelName) => {
          const SpendLimitValId = channels[channelName].spendlimitId;
          await Rules.deactivatePreviousSpendingLimitValues(
            channelName,
            credentials,
            SpendLimitValId,
          );
          if (channels[channelName].restrictionActivated === false) {
            const spendingLimitId = channels[channelName].restrictionId;

            return Rules.addSpendingLimitIntlRestriction(
              channelName,
              credentials,
              spendingLimitId,
            );
          }
        });
        const spendingAll = await Promise.all(loopres);
        const filteredData = spendingAll.filter((item) => item !== undefined);
        const restrictAllIntl = {};
        await Promise.all(
          filteredData.map(async (res) => {
            return channelsIntlSub.forEach(async (channelIntl) => {
              const SpendLimitValId = channels[channelIntl].spendlimitId;

              if (
                channelIntl.toLowerCase() ===
                res.data.name.split('_RESTRICTION')[0].toLowerCase()
              ) {
                restrictAllIntl[channelIntl] = {
                  restrictionId: res.data.id,
                  restrictionActivated: true,
                  spendlimitId: SpendLimitValId,
                };
              }
            });
          }),
        );

        setInternationalValue(0);
        setIntlEcommerceValue(0);
        setIntlPosChipValue(0);
        setIntlNfcValue(0);
        setIntlAtmValue(0);

        setIntlEcomRestriction(true);
        setIntlPosChipRestriction(true);
        setIntlPosNfcRestriction(true);
        setIntlAtmRestriction(true);

        await dispatch(setSpendingLimitChannel(restrictAllIntl));
        await dispatch(setSpendingLimitsLoading(false));
        await dispatch(getSpendingLimits(credentials));
      }
    } catch (error) {
      dispatch(setSpendingLimitsLoading(false));
      dispatch(
        showToast({
          message:
            error?.response?.status === 403
              ? 'Invalid Request with 403'
              : getRequestErrorMsg(error) || 'Unkown error occured',
          style: 'error',
        }),
      );
      await dispatch(getSpendingLimits(credentials));
    }
  };

  const removeRestrictionIntl = async (channel) => {
    const channelsIntlSub = [
      INTERNATIONAL,
      INTL_ECOM_SPEND_LIMIT,
      INTL_POS_SPEND_LIMIT,
      INTL_NFC_SPEND_LIMIT,
      INTL_ATM_SPEND_LIMIT,
    ];
    try {
      if (channel === INTERNATIONAL) {
        await removeRestriction(channel);
        const loopres = await channelsIntlSub.map((channelName) => {
          if (channels[channelName].restrictionActivated === false) {
            const spendingLimitId = channels[channelName].restrictionId;
            return Rules.addSpendingLimitIntlRestriction(
              channelName,
              credentials,
              spendingLimitId,
            );
          }
        });
        const spendingAll = await Promise.all(loopres);
        const filteredData = spendingAll.filter((item) => item !== undefined);
        const restrictAllIntl = {};
        await Promise.all(
          filteredData.map(async (res) => {
            return channelsIntlSub.forEach((channelIntl) => {
              const SpendLimitValId = channels[channelIntl].spendlimitId;
              if (
                channelIntl.toLowerCase() ===
                res.data.name.split('_RESTRICTION')[0].toLowerCase()
              ) {
                restrictAllIntl[channelIntl] = {
                  restrictionId: res.data.id,
                  restrictionActivated: true,
                  spendlimitId: SpendLimitValId,
                };
              }
            });
          }),
        );
        await dispatch(setSpendingLimitChannel(restrictAllIntl));
        await dispatch(setSpendingLimitsLoading(false));
        await dispatch(getSpendingLimits(credentials));
      }
    } catch (error) {
      dispatch(setSpendingLimitsLoading(false));
      dispatch(
        showToast({
          message:
            error?.response?.status === 403
              ? 'Invalid Request with 403'
              : getRequestErrorMsg(error) || 'Unkown error occured',
          style: 'error',
        }),
      );
      await dispatch(getSpendingLimits(customer?.accountId, credentials));
    }
  };

  const updateChannel = async (channel) => {
    dispatch(setSpendingLimitsLoading(true));
    if (channels[channel].restrictionActivated === false) {
      createRestriction(channel);
    } else {
      removeRestriction(channel);
    }
  };

  useEffect(() => {
    if (otpdata && otpdata.success) {
      dispatch(closeInternationalOtp());
      setOtpError('');
      handleIntlSubChannelSubmit();
      dispatch(clearOtpData());
    } else {
      setOtpError(otpdata.msg);
    }
  }, [otpdata]);

  const handleInternationalOtp = async (otp) => {
    setBtnDisabled(true);
    const otpValue = Object.values(otp).reduce((a, b) => a + b);
    if (otpValue?.length >= 6) {
      const data = {
        client: clientId,
        otptype: 'internationalTransactions',
        otp: otpValue,
      };
      await dispatch(
        submitInternationalOtpData(data, account_status, status_reason_id),
      );
    } else {
      setOtpError('Please Enter 6 Digit OTP');
    }
    setBtnDisabled(false);
  };

  const updateIntlChannel = async () => {
    dispatch(setSpendingLimitsLoading(true));
    if (channels[INTERNATIONAL].restrictionActivated === false) {
      createRestrictionIntl(INTERNATIONAL);
    } else {
      removeRestrictionIntl(INTERNATIONAL);
    }
  };

  const handleIntlCnfBtnClick = async () => {
    if (internationalValue > customer?.limits?.total_credit_limit) {
      dispatch(
        showToast({
          message: `Value should not be greater than your Account's credit limit of Rs ${customer?.limits?.total_credit_limit}`,
          style: 'error',
        }),
      );
    } else {
      if (
        isIntlEcomRestrictionGlobal === isIntlEcomRestriction &&
        isIntlPosRestrictionGlobal === isIntlPosChipRestriction &&
        isIntlPosNfcRestrictionGlobal === isIntlPosNfcRestriction &&
        isIntlAtmRestrictionGlobal === isIntlAtmRestriction &&
        intlLimitValueGlobal === internationalValue &&
        intlEcomLimitValueGlobal === IntlEcommerceValue &&
        intlPosLimitValueGlobal === IntlPosChipValue &&
        intlNfcLimitValueGlobal === IntlNfcValue &&
        intlAtmLimitValueGlobal === IntlAtmValue
      ) {
        dispatch(
          showToast({
            message: `Please Enter/Change the value or update the channel before proceeding`,
            style: 'error',
          }),
        );
      } else {
        if (
          parseFloat(internationalValue.toString().replace(/,/g, '')) > 0 ||
          isIntlEcomRestrictionGlobal !== isIntlEcomRestriction ||
          isIntlPosRestrictionGlobal !== isIntlPosChipRestriction ||
          isIntlPosNfcRestrictionGlobal !== isIntlPosNfcRestriction ||
          isIntlAtmRestrictionGlobal !== isIntlAtmRestriction
        ) {
          if (
            parseFloat(internationalValue.toString().replace(/,/g, '')) <
            Math.max(
              parseFloat(IntlEcommerceValue.toString().replace(/,/g, '')),
              parseFloat(IntlPosChipValue.toString().replace(/,/g, '')),
              parseFloat(IntlNfcValue.toString().replace(/,/g, '')),
              parseFloat(IntlAtmValue.toString().replace(/,/g, '')),
            )
          ) {
            dispatch(
              showToast({
                message: `Ensure the International Limit value should not be lower than the subcategories Limits`,
                style: 'error',
              }),
            );
          } else {
            const data = {
              client: clientId,
              otptype: 'internationalTransactions',
            };

            setOtpTriggerMsg(true);
            await dispatch(getCustomerOnboardOtpData(data))
              .then(() => {
                dispatch(openInternationalOtp());
                setOtpTriggerMsg(false);
              })
              .catch((error) => {
                dispatch(getSpendingLimits(credentials));

                const msg = getRequestErrorMsg(error);
                window.setTimeout(() => {
                  dispatch(
                    showToast({
                      message:
                        error?.response?.data?.msg ||
                        msg ||
                        'OTP generation for International Transactions activation is failed, Please try again',
                      style: 'error',
                    }),
                  );
                  setOtpTriggerMsg(false);
                }, 1000);
              });
          }
        } else {
          dispatch(
            showToast({
              message: `Please Enter the Value before proceeding`,
              style: 'error',
            }),
          );
        }
      }
    }
  };

  const updateSpendingLimitValue = async (channel, val) => {
    let checkVal = val.toString().replace(/,/g, '').split('.')[1] == '00';
    let value = '';
    if (checkVal) {
      value = parseFloat(val.toString().replace(/,/g, ''));
    } else {
      value = parseFloat(val.toString().replace(/,/g, ''));
    }
    const SpendLimitValId = channels[channel].spendlimitId;

    await dispatch(setSpendingLimitsLoading(true));
    const channelsIntlSub = [
      INTERNATIONAL,
      INTL_ECOM_SPEND_LIMIT,
      INTL_POS_SPEND_LIMIT,
      INTL_NFC_SPEND_LIMIT,
      INTL_ATM_SPEND_LIMIT,
    ];

    try {
      if (channelsIntlSub.includes(channel)) {
        if (
          Number(internationalValue) >= 0 &&
          Number(value) > internationalValue
        ) {
          switch (channel) {
            case INTL_ECOM_SPEND_LIMIT:
              setIntlEcommerceValue(0);
              break;
            case INTL_NFC_SPEND_LIMIT:
              setIntlNfcValue(0);
              break;
            case INTL_POS_SPEND_LIMIT:
              setIntlPosChipValue(0);
              break;
            case INTL_ATM_SPEND_LIMIT:
              setIntlAtmValue(0);
              break;
            default:
              break;
          }
          dispatch(
            showToast({
              message:
                'Entered value should be less than international limit value',
              style: 'error',
            }),
          );
          return;
        } else if (
          channel === INTERNATIONAL &&
          Number(internationalValue) === 0
        ) {
          await Promise.all(
            channelsIntlSub.map(async (channelSub) => {
              const SpendLimitValueId = channels[channelSub].spendlimitId;
              await Rules.deactivatePreviousSpendingLimitValues(
                channelSub,
                credentials,
                SpendLimitValueId,
              );
            }),
          );
          await dispatch(getSpendingLimits(credentials));

          dispatch(
            showToast(translate('spendingLimits.limitValueUpdateSuccess')),
          );
        } else {
          if (Number(value) > 0) {
            // const dayCloseCycle =
            // process.env.REACT_APP_DAY_RESET_SPENDING_LIMIT;
            const dayCloseCycle = customer?.cycleDueDate;
            const response = await Rules.addSpendingLimitValue(
              channel,
              value,
              dayCloseCycle,
              credentials,
              SpendLimitValId,
            );

            if (response?.status === 201 || response?.status === 200) {
              await dispatch(
                setSpendingLimitChannel({
                  [channel]: {
                    ...channels[channel],
                    limitValue:
                      response?.data?.type === 'restriction'
                        ? response.data?.conditions?.find(
                            (condition) => condition.attribute === 'amount',
                          )?.value
                        : response?.data?.max_limit,
                    dateResetValue: response?.data?.reset_datetime,
                    spendlimitId: SpendLimitValId,
                  },
                }),
              );
              await dispatch(getSpendingLimits(credentials));

              dispatch(
                showToast(translate('spendingLimits.limitValueUpdateSuccess')),
              );
            }
          } else if (Number(value === 0)) {
            await Rules.deactivatePreviousSpendingLimitValues(
              channel,
              credentials,
              SpendLimitValId,
            ).then(() => {
              dispatch(
                showToast(translate('spendingLimits.limitValueUpdateSuccess')),
              );
            });
            await dispatch(getSpendingLimits(credentials));
          }
          dispatch(setSpendingLimitsLoading(false));
        }
      } else {
        if (channel === 'pos_nfc' && Number(value === 0)) {
          dispatch(
            showToast({
              message: `Contactless Limit cannot be set to Zero`,
              style: 'error',
            }),
          );
        } else {
          if (Number(value) > 0) {
            // const dayCloseCycle =
            //   process.env.REACT_APP_DAY_RESET_SPENDING_LIMIT;
            const dayCloseCycle = customer?.cycleDueDate;
            const response = await Rules.addSpendingLimitValue(
              channel,
              value,
              dayCloseCycle,
              credentials,
              SpendLimitValId,
            );
            if (response?.status === 201 || response?.status === 200) {
              dispatch(
                setSpendingLimitChannel({
                  [channel]: {
                    ...channels[channel],
                    limitValue:
                      response?.data?.type === 'restriction'
                        ? response.data?.conditions?.find(
                            (condition) => condition.attribute === 'amount',
                          )?.value
                        : response?.data?.max_limit,
                    dateResetValue: response?.data?.reset_datetime,
                    spendlimitId: SpendLimitValId,
                    NoChannelLimitSetLength: false,
                  },
                }),
              );
              // await dispatch(getSpendingLimits(customer?.accountId, credentials));
              dispatch(
                showToast(translate('spendingLimits.limitValueUpdateSuccess')),
              );
            }
          }
          if (Number(value === 0)) {
            await Rules.deactivatePreviousSpendingLimitValues(
              channel,
              credentials,
              SpendLimitValId,
            ).then(() => {
              dispatch(
                showToast(translate('spendingLimits.limitValueUpdateSuccess')),
              );
            });
            await dispatch(getSpendingLimits(credentials));
          }
        }

        dispatch(setSpendingLimitsLoading(false));
      }
    } catch (error) {
      dispatch(
        showToast({
          message:
            error?.response?.status === 403
              ? 'Invalid Request with 403'
              : getRequestErrorMsg(error) || 'Unkown error occured',
          style: 'error',
        }),
      );
    } finally {
      await dispatch(setSpendingLimitsLoading(false));
    }
  };

  const dependency = channels[INTERNATIONAL].restrictionActivated;

  useEffect(() => {
    if (dependency) {
      setExpandAccordion(false);
    } else {
      setExpandAccordion(true);
    }
  }, [dependency]);

  const handleClose = () => {
    dispatch(closeInternationalOtp());
    dispatch(setInternationalOtpData({}));
    setOtpError('');
  };

  const setOnchangeValue = async (e, channel) => {
    var valueOfNum = parseFloat(e?.target?.value?.toString().replace(/,/g, ''));
    if (channel === 'international') {
      if (valueOfNum > customer?.limits?.total_credit_limit) {
        e.target.value = await parseFloat(internationalValue).toFixed(2);
        setInternationalValue(internationalValue);

        dispatch(
          showToast({
            message: `Value should not be greater than your Account's credit limit of Rs ${customer?.limits?.total_credit_limit}`,
            style: 'error',
          }),
        );
      } else {
        setInternationalValue(valueOfNum);
      }
    } else {
      switch (channel) {
        case 'ecommerce':
          setEcommerceValue(valueOfNum);
          break;
        case 'pos_chip':
          setPosChipValue(valueOfNum);
          break;
        case 'pos_nfc':
          if (parseFloat(valueOfNum) > RBI_LIMIT_FOR_POS_NFC) {
            e.target.value = await parseFloat(dosNfcLimitValue).toFixed(2);
            setPosNfcValue(dosNfcLimitValue);
            showPosNfcLimitMsg();
          } else if (parseFloat(valueOfNum) === 0) {
            setPosNfcValue(0);
            dispatch(
              showToast({
                message: `Contactless Limit cannot be set to Zero`,
                style: 'error',
              }),
            );
          } else {
            setPosNfcValue(valueOfNum);
          }
          break;
        case 'atm':
          setAtmValue(valueOfNum);
          break;

        default:
          break;
      }
    }
  };

  const onChangeIntlSubValue = async (e, channel) => {
    var valueOfNum = parseFloat(e?.target?.value?.toString().replace(/,/g, ''));
    var intlvalueOfNum = parseFloat(
      internationalValue.toString().replace(/,/g, ''),
    );
    if (valueOfNum <= intlvalueOfNum) {
      switch (channel) {
        case INTL_ECOM_SPEND_LIMIT:
          await setIntlEcommerceValue(valueOfNum);
          break;
        case INTL_NFC_SPEND_LIMIT:
          if (valueOfNum > RBI_LIMIT_FOR_POS_NFC) {
            e.target.value = await parseFloat(intlNfcLimitValueGlobal).toFixed(
              2,
            );
            await setIntlNfcValue(intlNfcLimitValueGlobal);
            showPosNfcLimitMsg();
          } else {
            await setIntlNfcValue(valueOfNum);
          }
          break;
        case INTL_POS_SPEND_LIMIT:
          await setIntlPosChipValue(valueOfNum);
          break;
        case INTL_ATM_SPEND_LIMIT:
          await setIntlAtmValue(valueOfNum);
          break;
        default:
          break;
      }
    } else {
      switch (channel) {
        case INTL_ECOM_SPEND_LIMIT:
          if (intlvalueOfNum >= intlEcomLimitValueGlobal) {
            e.target.value = await parseFloat(intlEcomLimitValueGlobal).toFixed(
              2,
            );
            setIntlEcommerceValue(intlEcomLimitValueGlobal);
          } else {
            e.target.value = await parseFloat(0).toFixed(2);
            setIntlEcommerceValue(0);
          }
          break;
        case INTL_NFC_SPEND_LIMIT:
          if (intlvalueOfNum >= intlNfcLimitValueGlobal) {
            e.target.value = await parseFloat(intlNfcLimitValueGlobal).toFixed(
              2,
            );
            setIntlNfcValue(intlNfcLimitValueGlobal);
          } else {
            e.target.value = await parseFloat(0).toFixed(2);
            setIntlNfcValue(0);
          }
          break;
        case INTL_POS_SPEND_LIMIT:
          if (intlvalueOfNum >= intlPosLimitValueGlobal) {
            e.target.value = await parseFloat(intlPosLimitValueGlobal).toFixed(
              2,
            );
            setIntlPosChipValue(intlPosLimitValueGlobal);
          } else {
            e.target.value = await parseFloat(0).toFixed(2);
            setIntlPosChipValue(0);
          }
          break;
        case INTL_ATM_SPEND_LIMIT:
          if (intlvalueOfNum >= intlAtmLimitValueGlobal) {
            e.target.value = await parseFloat(intlAtmLimitValueGlobal).toFixed(
              2,
            );
            setIntlAtmValue(intlAtmLimitValueGlobal);
          } else {
            e.target.value = await parseFloat(0).toFixed(2);
            setIntlAtmValue(0);
          }
          break;
        default:
          break;
      }
      dispatch(
        showToast({
          message: `Value should not be greater than your International limit`,
          style: 'error',
        }),
      );
    }
  };

  const handleIntlSubChannelSubmit = async () => {
    setIntlSubLoading(true);
    if (internationalValue !== intlLimitValueGlobal) {
      await updateSpendingLimitValue(INTERNATIONAL, internationalValue);
    }
    const subChannelList = [
      {
        channel: INTL_ECOM_SPEND_LIMIT,
        limitVal: IntlEcommerceValue,
        limitValGlobal: intlEcomLimitValueGlobal,
        restrictionActivated: isIntlEcomRestriction,
        restrictionActivatedGlobal: isIntlEcomRestrictionGlobal,
      },
      {
        channel: INTL_POS_SPEND_LIMIT,
        limitVal: IntlPosChipValue,
        limitValGlobal: intlPosLimitValueGlobal,
        restrictionActivated: isIntlPosChipRestriction,
        restrictionActivatedGlobal: isIntlPosRestrictionGlobal,
      },
      {
        channel: INTL_NFC_SPEND_LIMIT,
        limitVal: IntlNfcValue,
        limitValGlobal: intlNfcLimitValueGlobal,
        restrictionActivated: isIntlPosNfcRestriction,
        restrictionActivatedGlobal: isIntlPosNfcRestrictionGlobal,
      },
      {
        channel: INTL_ATM_SPEND_LIMIT,
        limitVal: IntlAtmValue,
        limitValGlobal: intlAtmLimitValueGlobal,
        restrictionActivated: isIntlAtmRestriction,
        restrictionActivatedGlobal: isIntlAtmRestrictionGlobal,
      },
    ];
    for (let subChannel of subChannelList) {
      const {
        channel,
        limitVal,
        limitValGlobal,
        restrictionActivated,
        restrictionActivatedGlobal,
      } = subChannel;
      var restrictionId = channels[subChannel.channel].restrictionId;
      let spendingLimitValId = channels[subChannel.channel].spendlimitId;
      if (restrictionActivatedGlobal !== restrictionActivated) {
        if (restrictionActivated) {
          if (limitVal !== 0) {
            const spendingLimitValId =
              channels[subChannel.channel].spendlimitId;
            await Rules.deactivatePreviousSpendingLimitValues(
              channel,
              credentials,
              spendingLimitValId,
            );
          }
          await Rules.addSpendingLimitIntlRestriction(
            channel,
            credentials,
            restrictionId,
          )
            .then(async (res) => {
              await dispatch(
                setSpendingLimitChannel({
                  [channel]: {
                    restrictionId: restrictionId,
                    restrictionActivated: true,
                    spendlimitId: spendingLimitValId,
                  },
                }),
              );
              await dispatch(getSpendingLimits(credentials));
            })
            .catch((error) =>
              dispatch(
                setSpendingLimitChannel({
                  [channel]: {
                    restrictionId: restrictionId,
                    restrictionActivated: false,
                    spendlimitId: spendingLimitValId,
                  },
                }),
              ),
            );
        } else {
          await Rules.removeSpendingLimitRestriction(restrictionId, credentials)
            .then(async (res) => {
              await dispatch(
                setSpendingLimitChannel({
                  [channel]: {
                    ...channels[channel],
                    restrictionId: restrictionId,
                    restrictionActivated: false,
                    spendlimitId: spendingLimitValId,
                  },
                }),
              );
              await dispatch(getSpendingLimits(credentials));
              if (limitVal !== limitValGlobal) {
                await updateSpendingLimitValue(channel, limitVal);
              }
            })
            .catch((error) =>
              dispatch(
                setSpendingLimitChannel({
                  [channel]: {
                    ...channels[channel],
                    restrictionId: restrictionId,
                    restrictionActivated: true,
                    spendlimitId: spendingLimitValId,
                  },
                }),
              ),
            );
        }
        continue;
      } else if (!restrictionActivated && limitVal !== limitValGlobal) {
        await updateSpendingLimitValue(channel, limitVal);
      }
    }
    setIntlSubLoading(false);
  };

  return (
    <div>
      <section className="bg-pismo-near-white ph3 pv4 tw-h-full SpendingLimits">
        <MasterSpendingLimitChannels
          Mloading={loading}
          loggedInRole={loggedInRole}
          supplementryCustDetails={customerList}
          isCustomerListCallSuccess={isCustomerListGetcall}
          handleCustomerListCall={getCustomerListGetCall}
        />
        <div
          style={{
            backgroundColor: '#e6f5ff',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          <h3 className="tw-text-2xl tw-mt-0">
            <FormattedMessage id="spendingLimits.channels.Domestic" />
          </h3>
          <CustomerSpendingLimitChannel
            channel={'ecommerce'}
            label={'E-COMMERCE'}
            loading={loading || isIntlSubLoading}
            restrictionActivated={channels.ecommerce.restrictionActivated}
            valueLimit={ecommerceValue}
            onChangeRestriction={() => updateChannel('ecommerce')}
            onChangeValue={(e) => setOnchangeValue(e, 'ecommerce')}
            onSaveValue={() =>
              updateSpendingLimitValue('ecommerce', ecommerceValue)
            }
            dateResetValue={channels.ecommerce.dateResetValue}
            disabled={!canUpdateLimits}
            NoSetLimitMessage={channels.ecommerce.NoChannelLimitSetLength}
          />

          <CustomerSpendingLimitChannel
            channel={'pos_chip'}
            label={'POS (CHIP)'}
            loading={loading || isIntlSubLoading}
            restrictionActivated={channels.pos_chip.restrictionActivated}
            valueLimit={posChipValue}
            onChangeRestriction={() => updateChannel('pos_chip')}
            onChangeValue={(e) => setOnchangeValue(e, 'pos_chip')}
            onSaveValue={() =>
              updateSpendingLimitValue('pos_chip', posChipValue)
            }
            dateResetValue={channels.pos_chip.dateResetValue}
            disabled={!canUpdateLimits}
            NoSetLimitMessage={channels.pos_chip.NoChannelLimitSetLength}
          />

          <CustomerSpendingLimitChannel
            channel={'pos_nfc'}
            label={clientId === 'CL_00UTKB' ? 'POS (CONTACTLESS)' : 'POS (NFC)'}
            loading={loading || isIntlSubLoading}
            restrictionActivated={channels.pos_nfc.restrictionActivated}
            valueLimit={posNfcValue}
            onChangeRestriction={() => updateChannel('pos_nfc')}
            onChangeValue={(e) => setOnchangeValue(e, 'pos_nfc')}
            onSaveValue={() => updateSpendingLimitValue('pos_nfc', posNfcValue)}
            dateResetValue={channels.pos_nfc.dateResetValue}
            disabled={!canUpdateLimits}
            NoSetLimitMessage={channels.pos_nfc.NoChannelLimitSetLength}
          />

          <CustomerSpendingLimitChannel
            channel={'atm'}
            label={'ATM'}
            loading={loading || isIntlSubLoading}
            restrictionActivated={channels.atm.restrictionActivated}
            valueLimit={atmValue}
            onSaveValue={() => updateSpendingLimitValue('atm', atmValue)}
            onChangeRestriction={() => updateChannel('atm')}
            onChangeValue={(e) => setOnchangeValue(e, 'atm')}
            dateResetValue={channels.atm.dateResetValue}
            disabled={!canUpdateLimits}
            NoSetLimitMessage={channels.atm.NoChannelLimitSetLength}
            withDrawalAmount={customer?.limits?.withdrawal_credit_limit}
          />
        </div>

        <section className="pv4 tw-h-full">
          <Accordion
            className="Mui-accordian-expanded"
            expanded={expandAccordion}
          >
            <AccordionSummary>
              <div className="intl-accordian-Summary-main">
                <div className="intl-accordian-Summary">
                  <div>
                    <h3 className="tw-text-2xl tw-mt-0">
                      <FormattedMessage id="spendingLimits.channels.International" />
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InternationalToggleButton
                      channel={INTERNATIONAL}
                      restrictionActivated={
                        channels[INTERNATIONAL].restrictionActivated
                      }
                      onChangeRestriction={updateIntlChannel}
                      loading={isIntlSubLoading || loading}
                      disabled={!canUpdateLimits}
                    />
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  {expandAccordion ? (
                    ''
                  ) : (
                    <BiChevronDown style={{ fontSize: '30px' }} />
                  )}
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div
                style={{
                  width: '100%',
                  marginTop: '-20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ width: '100%' }}>
                    <InternationalInput
                      channel={INTERNATIONAL}
                      label={'Maximum International Limit'}
                      loading={loading || isIntlSubLoading}
                      restrictionActivated={
                        channels[INTERNATIONAL].restrictionActivated
                      }
                      onChangeValue={(e) => setOnchangeValue(e, INTERNATIONAL)}
                      dateResetValue={channels[INTERNATIONAL].dateResetValue}
                      valueLimit={internationalValue}
                      disabled={!canUpdateLimits}
                    />
                  </div>

                  <div>
                    {!channels[INTERNATIONAL].restrictionActivated && (
                      <>
                        {otpTriggerMsg ? (
                          <Loader size="small" />
                        ) : (
                          <Button
                            disabled={
                              isIntlSubLoading || loading || !canUpdateLimits
                            }
                            text={translate('spendingLimits.confirm')}
                            type="button"
                            className={`button button--save bg-pismo-yellow basis-0 grow-0 shrink  ${
                              isIntlSubLoading || loading
                                ? 'button--disabled'
                                : ''
                            }`}
                            onClick={handleIntlCnfBtnClick}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

                <CustomerSpendingLimitIntlSubChannels
                  channel={INTL_ECOM_SPEND_LIMIT}
                  label={'E-COMMERCE'}
                  loading={loading || isIntlSubLoading}
                  restrictionActivated={isIntlEcomRestriction}
                  onChangeRestriction={() =>
                    setIntlEcomRestriction(!isIntlEcomRestriction)
                  }
                  onChangeValue={(e) =>
                    onChangeIntlSubValue(e, INTL_ECOM_SPEND_LIMIT)
                  }
                  dateResetValue={
                    channels[INTL_ECOM_SPEND_LIMIT].dateResetValue
                  }
                  valueLimit={IntlEcommerceValue}
                  disabled={!canUpdateLimits}
                />

                <CustomerSpendingLimitIntlSubChannels
                  channel={INTL_POS_SPEND_LIMIT}
                  label={'POS (CHIP)'}
                  loading={loading || isIntlSubLoading}
                  restrictionActivated={isIntlPosChipRestriction}
                  onChangeRestriction={() =>
                    setIntlPosChipRestriction(!isIntlPosChipRestriction)
                  }
                  onChangeValue={(e) =>
                    onChangeIntlSubValue(e, INTL_POS_SPEND_LIMIT)
                  }
                  dateResetValue={channels[INTL_POS_SPEND_LIMIT].dateResetValue}
                  valueLimit={IntlPosChipValue}
                  disabled={!canUpdateLimits}
                />

                <CustomerSpendingLimitIntlSubChannels
                  channel={INTL_NFC_SPEND_LIMIT}
                  label={
                    clientId === 'CL_00UTKB' ? 'POS (CONTACTLESS)' : 'POS (NFC)'
                  }
                  loading={loading || isIntlSubLoading}
                  restrictionActivated={isIntlPosNfcRestriction}
                  onChangeRestriction={() =>
                    setIntlPosNfcRestriction(!isIntlPosNfcRestriction)
                  }
                  onChangeValue={(e) => {
                    onChangeIntlSubValue(e, INTL_NFC_SPEND_LIMIT);
                  }}
                  dateResetValue={channels[INTL_NFC_SPEND_LIMIT].dateResetValue}
                  valueLimit={IntlNfcValue}
                  disabled={!canUpdateLimits}
                />

                <CustomerSpendingLimitIntlSubChannels
                  channel={INTL_ATM_SPEND_LIMIT}
                  label={'ATM'}
                  loading={loading || isIntlSubLoading}
                  restrictionActivated={isIntlAtmRestriction}
                  onChangeRestriction={() =>
                    setIntlAtmRestriction(!isIntlAtmRestriction)
                  }
                  onChangeValue={(e) =>
                    onChangeIntlSubValue(e, INTL_ATM_SPEND_LIMIT)
                  }
                  dateResetValue={channels[INTL_ATM_SPEND_LIMIT].dateResetValue}
                  valueLimit={IntlAtmValue}
                  disabled={!canUpdateLimits}
                  withDrawalAmount={customer?.limits?.withdrawal_credit_limit}
                />
              </div>
            </AccordionDetails>
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {expandAccordion ? (
                <BiChevronUp style={{ fontSize: '30px' }} />
              ) : (
                ''
              )}
            </div>
          </Accordion>
        </section>
        {isInternationalOtpOpen && (
          <InternationalOtpModal
            isOtpOpen={isInternationalOtpOpen}
            handleOtpSubmit={handleInternationalOtp}
            error={otpError}
            disabled={otpdata?.msg === MAX_LIMIT_TAKEN}
            handleClose={() => handleClose()}
            btnDisabled={btnDisabled}
          />
        )}
      </section>
    </div>
  );
};

const mapStateToProps = (
  { spendingLimits, customer, credentials, org, statements, internationalOtp },
  props,
) => ({
  spendingLimits,
  customer,
  credentials,
  org,
  statements,
  internationalOtp,
  ...props,
});

export default compose(connect(mapStateToProps))(
  injectIntl(CustomerSpendingLimits),
);
