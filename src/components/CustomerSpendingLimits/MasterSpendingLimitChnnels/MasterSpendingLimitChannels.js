import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import '.././CustomerSpendingLimits.scss';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Slider,
  makeStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  setCustomer,
  setCustomerParams,
  showToast,
  submitLimitProposal,
} from 'actions';
import { Button, Loader, TextInput } from 'components/commons';
import SupplementaryLimitControls from './SupplementaryLimitControls';
import { MdRefresh } from 'react-icons/md';
import { AdminGroups } from 'utils/coral/TenantConfig';
import { Accounts } from 'clients';
import { cloneDeep } from 'lodash';

const MasterSpendingLimitChannels = ({
  customer,
  dispatch,
  credentials,
  intl,
  Mloading,
  routeWatcher,
  supplementryCustDetails,
  isCustomerListCallSuccess,
  handleCustomerListCall,
  loggedInRole,
}) => {
  const { limits = {}, accountId: account_id } = customer;
  const { max_credit_limit, total_credit_limit, available_credit_limit } =
    limits;

  const marks = [
    {
      value: max_credit_limit * 0.0,
      label: '',
    },
    {
      value: max_credit_limit * 0.1,
      label: '10%',
    },
    {
      value: max_credit_limit * 0.2,
      label: '20%',
    },
    {
      value: max_credit_limit * 0.3,
      label: '30%',
    },
    {
      value: max_credit_limit * 0.4,
      label: '40%',
    },
    {
      value: max_credit_limit * 0.5,
      label: '50%',
    },
    {
      value: max_credit_limit * 0.6,
      label: '60%',
    },
    {
      value: max_credit_limit * 0.7,
      label: '70%',
    },
    {
      value: max_credit_limit * 0.8,
      label: '80%',
    },
    {
      value: max_credit_limit * 0.9,
      label: '90%',
    },
    {
      value: max_credit_limit,
      label: '',
    },
  ];

  const [isLimit, setIsLimit] = useState(total_credit_limit);
  const [btnDisable, setBtnDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [usageLimit, setUsageLimit] = useState(0);
  const [sliderValue, setSliderValue] = useState(total_credit_limit);
  const [supplementaryCustomersArray, setSupplementaryCustomersArray] =
    useState([]);
  const translate = (id) => intl.formatMessage({ id });
  const canUpdateLimits = AdminGroups.includes(loggedInRole);
  const [supplyMentryReload, setSupplyMentryReload] = useState(null);
  const [supplymentryCardsLimits, setSupplymentryCardsLimits] = useState({});
  const limitfunc = () => {
    setIsLimit(total_credit_limit);
  };

  useEffect(() => {
    limitfunc();
  }, [customer]);

  useEffect(() => {
    const accountId = sessionStorage.getItem('pismo-account-id');
    const findPrimaryCust = supplementryCustDetails?.filter(
      (item) =>
        item?.account_id == accountId && item?.customer?.is_owner === true,
    );

    if (findPrimaryCust?.length > 0) {
      const supArray = supplementryCustDetails?.filter(
        (item) => item?.customer?.is_owner === false,
      );

      supArray?.length > 0
        ? setSupplementaryCustomersArray(supArray)
        : setSupplementaryCustomersArray([]);
    }
  }, [supplementryCustDetails]);

  useEffect(() => {
    setUsageLimit((total_credit_limit / max_credit_limit) * 100);
  }, [customer]);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 300,
    },

    margin: {
      height: theme.spacing(3),
    },

    thumb: {
      zIndex: '9999',
      background: 'grey',
    },
    mark: {
      backgroundColor: 'transparent',
      background:
        'linear-gradient(to bottom, transparent, transparent 30%, grey 50%, grey);',
      height: '12px',
    },
    markLabel: {
      fontSize: '11px',
      marginLeft: '5px',
      '@media(max-width: 1000px)': {
        marginTop: '-3px',
        fontSize: '9px',
      },
    },

    rail: {
      backgroundColor: '#ccc',
      background:
        total_credit_limit - available_credit_limit <= 0 ||
        available_credit_limit < 0
          ? `linear-gradient(to right, #D9D9D9 100%)`
          : `linear-gradient(to right, #FF0000 ${Math.round(
              ((total_credit_limit - available_credit_limit) /
                max_credit_limit) *
                100,
            )}% ,#D9D9D9 ${Math.round(
              ((total_credit_limit - available_credit_limit) /
                max_credit_limit) *
                100,
            )}% ${
              Math.round(
                ((total_credit_limit - available_credit_limit) /
                  max_credit_limit) *
                  100,
              ) - 100
            }%) !important

            `,
      height: '5px',
      borderRadius: '5px',
    },

    rail1: {
      zIndex: '9999',
      backgroundColor: 'transparent',
      background:
        total_credit_limit - available_credit_limit <= 0 ||
        available_credit_limit < 0
          ? `linear-gradient(to right, transparent 100%)`
          : `linear-gradient(to right, #FF0000 ${Math.round(
              ((total_credit_limit - available_credit_limit) /
                max_credit_limit) *
                100,
            )}% ,transparent ${Math.round(
              ((total_credit_limit - available_credit_limit) /
                max_credit_limit) *
                100,
            )}% ${
              Math.round(
                ((total_credit_limit - available_credit_limit) /
                  max_credit_limit) *
                  100,
              ) - 100
            }%) !important

          `,

      height: '5px',
      borderRadius: '5px',
    },
    thumb2: {
      zIndex: '99',
      display: 'none',
    },
    track: {
      borderRadius: '5px',
      background: '#ff9800',
      height: '5px',
    },
    track1: {
      background: 'transparent',
      height: '5px',
    },
  }));

  const classes = useStyles();

  const handleSliderUpdate = async (val) => {
    setBtnDisable(false);

    if (val > max_credit_limit) {
      dispatch(
        showToast({
          message: 'Limit cannot be set more than max credit limit',
          style: 'error',
        }),
      );

      setIsLimit(max_credit_limit);
      setSliderValue(max_credit_limit);
    } else {
      if (val == total_credit_limit) {
        setBtnDisable(true);
      }
      setUsageLimit((val / max_credit_limit) * 100);
      setIsLimit(val);
      setSliderValue(val);
    }
  };

  const handleInputUpdate = async (ev) => {
    setBtnDisable(false);

    const val = parseFloat(ev.target.value.toString().replace(/,/g, ''));

    if (val > max_credit_limit) {
      setBtnDisable(true);

      dispatch(
        showToast({
          message: 'Limit cannot be set more than max credit limit',
          style: 'error',
        }),
      );

      ev.target.value = await parseFloat(isLimit).toFixed(2);

      setIsLimit(isLimit);
    } else {
      if (val == total_credit_limit) {
        setBtnDisable(true);
      }
      setUsageLimit((val / max_credit_limit) * 100);
      setIsLimit(val);
    }
  };

  const handleLimitChange = () => {
    const nextlimit = parseFloat(isLimit.toString().replace(/,/g, ''));

    if (nextlimit == total_credit_limit) {
      setBtnDisable(true);
    } else {
      if (nextlimit > max_credit_limit) {
        dispatch(
          showToast({
            message: 'Limit cannot be set more than max credit limit',
            style: 'error',
          }),
        );
      } else {
        const body = {
          new_limit: nextlimit,
        };
        setLoading(true);
        dispatch(
          submitLimitProposal(account_id, body, max_credit_limit, credentials),
        )
          .then(async () => {
            await Accounts.getAccountLimits(customer?.accountId, credentials)
              .then((response) => {
                let newCustomer = cloneDeep(customer);
                newCustomer['credit_limits']['available'] =
                  response?.available_credit_limit;
                newCustomer['credit_limits']['total'] =
                  response?.total_credit_limit;
                newCustomer['limits'] = response;
                let newCreditLimits = cloneDeep(newCustomer['credit_limits']);

                dispatch(setCustomer({ ...newCustomer }));
                dispatch(
                  setCustomerParams({
                    ...newCustomer?.contract,
                    ...newCreditLimits,
                    ...newCustomer?.account,
                  }),
                );
              })
              .catch((e) => {
                dispatch(
                  showToast({
                    message: `Failed to fetch the Account limits`,
                    style: 'error',
                  }),
                );
              });

            setBtnDisable(true);
            setLoading(false);
            // routeWatcher.reload();
            window.setTimeout(() => {
              dispatch(
                showToast({
                  message: translate('profile.limit.outcome.success'),

                  style: 'success',
                }),
              );
            }, 1200);
          })

          .catch((err) => {
            setBtnDisable(true);

            setLoading(false);

            window.setTimeout(() => {
              dispatch(
                showToast({
                  message: translate('profile.limit.outcome.failure'),

                  style: 'error',
                }),
              );
            }, 1200);
          });
      }
    }
  };

  const mcInput = {
    backgroundColor: 'white',

    border: 'none',

    borderRadius: '6px',
  };

  return (
    <div>
      <section className="bg-pismo-near-white pv4 tw-h-full SpendingLimits">
        {isCustomerListCallSuccess ? (
          <>
            <div className="master-bg-clr">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div>
                  <h3 className="tw-text-2xl tw-mt-0">
                    <FormattedMessage id="spendingLimits.channels.MasterChannels" />
                  </h3>
                </div>

                <div>
                  <h3
                    className="tw-text-2xl tw-mt-0"
                    style={{
                      backgroundColor: 'white',
                      padding: '4px 10px 10px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={handleCustomerListCall}
                  >
                    <MdRefresh />
                  </h3>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="master-bg-clr">
              <h3 className="tw-text-2xl tw-mt-0">
                <FormattedMessage id="spendingLimits.channels.MasterChannels" />
              </h3>

              {!Mloading ? (
                <>
                  {supplementryCustDetails?.length > 0 && (
                    <div>
                      <div className="slider-p-div">
                        <div className="slider-val-div">
                          <div>0</div>

                          <div>
                            {Intl.NumberFormat('en-IN').format(
                              max_credit_limit,
                            )}
                          </div>
                        </div>

                        <section className="slider-section">
                          <Slider
                            className="slider-layer"
                            classes={{
                              rail: classes.rail1,
                              thumb: classes.thumb2,
                              track: classes.track1,
                            }}
                          />

                          <Slider
                            className="slider-layer"
                            classes={{
                              rail: classes.rail1,
                              thumb: classes.thumb2,
                              track: classes.track1,
                            }}
                          />

                          <Slider
                            classes={{
                              thumb: classes.thumb,
                              rail: classes.rail,
                              track: classes.track,
                              mark: classes.mark,
                              markLabel: classes.markLabel,
                            }}
                            value={isLimit}
                            sliderValue={sliderValue}
                            step={10}
                            marks={marks.map((l, i) => ({
                              label: l.label,

                              value: l.value,
                            }))}
                            min={0}
                            max={max_credit_limit}
                            onChange={
                              !canUpdateLimits
                                ? () => {}
                                : (_, val) => handleSliderUpdate(val)
                            }
                          />
                        </section>

                        <div className="tw-flex tw-items-center tw-justify-between tw-mt-4">
                          <div className="tw-flex tw-items-flex-end tw-justify-start tw-mt-4">
                            <div>
                              <p className="slider-input-hd">Usage %</p>

                              <TextInput
                                type="number"
                                name="usage"
                                value={
                                  usageLimit.toFixed(2).split('.')[1] === '00'
                                    ? String(Math.round(usageLimit))
                                    : parseFloat(usageLimit).toFixed(2)
                                }
                                size="Normal"
                                className="tw-flex-1 tw-mr-2 usage-input"
                                variant="outlined"
                                style={mcInput}
                                disabled={!canUpdateLimits}
                              />
                            </div>

                            <div className="setlmt-div">
                              <p className="slider-input-hd">Set Limit</p>

                              <TextInput
                                type="currency"
                                name="setlimit"
                                onChange={
                                  !canUpdateLimits
                                    ? () => {}
                                    : handleInputUpdate
                                }
                                value={isLimit}
                                sliderValue={sliderValue}
                                size="Normal"
                                className="tw-flex-1 tw-mr-2 setlimt-input"
                                variant="outlined"
                                style={mcInput}
                                disabled={!canUpdateLimits}
                              />
                            </div>
                          </div>

                          <div
                            style={{
                              marginRight: '10px',
                              cursor: 'pointer',
                            }}
                            className="tw-flex tw-items-flex-end tw-justify-start tw-mt-4"
                          >
                            {loading ? (
                              <Loader />
                            ) : (
                              <Button
                                onClick={
                                  !canUpdateLimits
                                    ? () => {}
                                    : handleLimitChange
                                }
                                text={'save'}
                                size="small"
                                className={`button button--save bg-pismo-yellow basis-0 grow-0 shrink sl-save-btn ${
                                  btnDisable ? 'button--disabled' : ''
                                }`}
                                disabled={btnDisable}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: '30px',
                        }}
                      >
                        {supplementaryCustomersArray.length > 0 &&
                          supplementaryCustomersArray?.map((item, i) => {
                            return (
                              <SupplementaryLimitControls
                                key={i}
                                canUpdateLimits={canUpdateLimits}
                                SuppelemtaryItems={item}
                                index={i}
                                liftedState={
                                  supplymentryCardsLimits[item?.customer?.id] ||
                                  undefined
                                }
                                setSupplymentryCardsLimits={(
                                  limit,
                                  id,
                                  FlexId,
                                  isLimitGlobalVal,
                                  customerId,
                                ) => {
                                  setSupplymentryCardsLimits((prev) => {
                                    prev[id] = {
                                      limit,
                                      FlexId,
                                      isLimitGlobalVal,
                                      customerId,
                                    };

                                    return prev;
                                  });
                                }}
                                total_credit_limit={total_credit_limit}
                                max_credit_limit={max_credit_limit}
                                supplyMentryReload={supplyMentryReload}
                                setSupplyMentryReload={setSupplyMentryReload}
                              />
                            );
                          })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Loader />
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const mapStateToProps = (
  { spendingLimits, customer, credentials, limitProposal, routeWatcher },

  props,
) => ({
  spendingLimits,

  credentials,

  limitProposal,

  routeWatcher,

  customer,

  ...props,
});

export default compose(connect(mapStateToProps))(
  injectIntl(MasterSpendingLimitChannels),
);
