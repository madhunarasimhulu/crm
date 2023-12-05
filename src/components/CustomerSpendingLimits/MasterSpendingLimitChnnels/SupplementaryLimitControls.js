import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
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
import { showToast, submitLimitProposal } from 'actions';
import { Button, Loader, TextInput } from 'components/commons';
import { BiChevronUp } from 'react-icons/bi';
import { Rules } from 'clients';
import { MdRefresh } from 'react-icons/md';
import { parse } from 'date-fns';

const SupplementaryLimitControls = ({
  customer,
  dispatch,
  credentials,
  intl,
  Mloading,
  SuppelemtaryItems,
  index,
  total_credit_limit,
  max_credit_limit,
  canUpdateLimits,
  supplyMentryReload,
  setSupplyMentryReload,
  setSupplymentryCardsLimits,
  liftedState,
}) => {
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

  const [isLimit, setIsLimit] = useState(0);
  const [isLimitGlobalVal, setIsLimitGlobalVal] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [FlexId, setFlexId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [expandAccordion, setExpandAccordion] = useState(false);
  const [isCustomerFlexCreate, setIsCustomerFlexCreate] = useState(false);
  const [isCustomerFlexUpdate, setIsCustomerFlexUpdate] = useState(false);
  const translate = (id) => intl.formatMessage({ id });

  const mcInput = {
    backgroundColor: '#f2f2f2',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
  };

  const getFormattedDate = (date) => {
    const newDate = `${String(date).substring(0, 10)}T12:00:00Z`.split('T');
    return parse(newDate, 'yyyy-MM-dd', new Date()).getDate();
  };
  useEffect(() => {
    if (Boolean(liftedState?.limit) === false) {
      getCustomerFlexControlLimits();
    }
  }, []);

  useEffect(() => {
    if (supplyMentryReload !== SuppelemtaryItems?.customer?.id) return;
    getCustomerFlexControlLimits();
  }, [supplyMentryReload]);

  useEffect(() => {
    setSupplymentryCardsLimits(
      isLimit,
      SuppelemtaryItems?.customer?.id,
      FlexId,
      isLimitGlobalVal,
      customerId,
    );
  }, [isLimit, FlexId, isLimitGlobalVal, customerId]);

  useEffect(() => {
    if (String(liftedState?.limit) !== String(isLimit)) {
      setIsLimit(liftedState?.limit);
    }
    if (String(liftedState?.FlexId) !== String(FlexId)) {
      setFlexId(liftedState?.FlexId);
    }
    if (String(liftedState?.isLimitGlobalVal) !== String(isLimitGlobalVal)) {
      setIsLimitGlobalVal(liftedState?.isLimitGlobalVal);
    }
    if (String(liftedState?.customerId) !== String(customerId)) {
      setCustomerId(liftedState?.customerId);
    }
  }, [liftedState]);

  const makeSupplementaryPayload = (accountId, maxLimit) => {
    const valuePersed = Math.ceil(maxLimit * 100);
    return {
      type: 'spending_limit',
      reset_period: {
        month_day: customer?.cycleDueDate || 1,
        utc_time: '00:00AM',
      },
      active: true,
      name: `Customer_Limit`,
      account_id: accountId,
      currency_code: 'INR',
      max_limit: valuePersed,
      limit_duration: 'P1M',
      time_zone: 'Asia/Kolkata',
      deny_code: 'customer_limit_value_exceeded',
      customized: true,
    };
  };

  const getCustomerFlexControlLimits = async () => {
    const dueDateArray = [];
    setLoading(true);
    await Rules.getCustomerSpendingLimitControls(
      SuppelemtaryItems?.customer?.id,
      credentials,
    )
      .then(async (response) => {
        if (response?.data?.length > 0) {
          const flexLimitData = response?.data?.filter(
            (custSpendingControl) => {
              return (
                custSpendingControl.customer_id ===
                SuppelemtaryItems?.customer?.id
              );
            },
          );

          if (flexLimitData?.length > 0) {
            const supCustomerControl = flexLimitData[flexLimitData?.length - 1];
            const dbDate = getFormattedDate(supCustomerControl?.reset_datetime);
            if (dbDate === 1) {
              dueDateArray.push({
                dueDate: dbDate,
                supplyFlexId: supCustomerControl?.id,
                custId: supCustomerControl?.customer_id,
              });
            }

            if (supCustomerControl?.active === false) {
              setIsLimit(0);
              setIsLimitGlobalVal(0);
              setFlexId(supCustomerControl?.id);
              setCustomerId(supCustomerControl?.customer_id);
            } else {
              setIsLimit(supCustomerControl?.max_limit / 100);
              setIsLimitGlobalVal(supCustomerControl?.max_limit / 100);
              setFlexId(supCustomerControl?.id);
              setCustomerId(supCustomerControl?.customer_id);
            }

            setLoading(false);
          }
        } else {
          const data = makeSupplementaryPayload(
            SuppelemtaryItems?.account_id,
            total_credit_limit,
          );
          await Rules.createCustomerSpendingLimitControl(
            data,
            SuppelemtaryItems?.customer?.id,
            credentials,
          )
            .then((response) => {
              setIsLimit(response?.data?.max_limit / 100);
              setIsLimitGlobalVal(response?.data?.max_limit / 100);
              setFlexId(response?.data?.id);
            })
            .catch((e) => {
              dispatch(
                showToast({
                  message: 'Failed to set the limits, Please try again later',
                  style: 'error',
                }),
              );
              setIsCustomerFlexCreate(true);
              setLoading(false);
            });
        }
      })
      .catch((e) => {
        if (e?.response?.status === 404) {
          setLoading(true);
          const data = makeSupplementaryPayload(
            SuppelemtaryItems?.account_id,
            total_credit_limit,
          );
          Rules.createCustomerSpendingLimitControl(
            data,
            SuppelemtaryItems?.customer?.id,
            credentials,
          )
            .then((response) => {
              setIsLimit(response?.data?.max_limit / 100);
              setIsLimitGlobalVal(response?.data?.max_limit / 100);
              setFlexId(response?.data?.id);
            })
            .catch((e) => {
              dispatch(
                showToast({
                  message: 'Failed to set the limits, Please try again later',
                  style: 'error',
                }),
              );
              setIsCustomerFlexCreate(true);
              setLoading(false);
            });
        } else {
          dispatch(
            showToast({
              message: 'Failed to set the limits, Please try again later',
              style: 'error',
            }),
          );
          setIsCustomerFlexCreate(true);
          setLoading(false);
        }
      });
    setLoading(false);

    if (dueDateArray.length > 0) {
      if (
        customer?.cycleDueDate != '' &&
        customer?.cycleDueDate != null &&
        customer?.cycleDueDate != undefined
      ) {
        if (customer?.cycleDueDate != dueDateArray[0]?.dueDate) {
          const data = {
            reset_period: {
              month_day: Number(customer?.cycleDueDate),
              utc_time: '00:00AM',
            },
          };
          await Rules.updateSupplementaryResetDatetoDueDate(
            data,
            dueDateArray[0]?.custId,
            dueDateArray[0]?.supplyFlexId,
            credentials,
          );
        }
      }
    }
  };

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
      height: '5px',
      borderRadius: '5px',
    },
    track: {
      borderRadius: '5px',
      background: '#ff9800',
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
    } else {
      setIsLimit(val);
    }
  };

  const handleLimitChange = () => {
    UpdateCustomerFlexControlLimits();
  };

  const UpdateCustomerFlexControlLimits = async () => {
    const nextlimit = parseFloat(isLimit.toString().replace(/,/g, ''));
    if (nextlimit > max_credit_limit) {
      dispatch(
        showToast({
          message: 'Limit cannot be set more than max credit limit',
          style: 'error',
        }),
      );
    } else {
      setLoading(true);
      const valuePersed = Math.ceil(nextlimit * 100);

      let data = {};
      valuePersed == 0
        ? (data = {
            active: false,
          })
        : (data = {
            max_limit: valuePersed,
            active: true,
          });

      // if (FlexId != '' && FlexId != undefined && FlexId != null) {
      await Rules.updateCustomerSpendingLimitControl(
        data,
        customerId,
        FlexId,
        credentials,
      )
        .then((response) => {
          if (response?.data?.active === false) {
            setIsLimit(0);
            setIsLimitGlobalVal(0);
          } else {
            setIsLimit(response?.data?.max_limit / 100);
            setIsLimitGlobalVal(response?.data?.max_limit / 100);
          }
          setBtnDisable(true);
          setLoading(false);
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
          setIsCustomerFlexUpdate(true);
          window.setTimeout(() => {
            dispatch(
              showToast({
                message: translate('profile.limit.outcome.failure'),
                style: 'error',
              }),
            );
          }, 1200);
        });

      // }
      // else {
      //   const data = makeSupplementaryPayload(
      //     SuppelemtaryItems?.account_id,
      //     total_credit_limit,
      //   );
      //   await Rules.createCustomerSpendingLimitControl(
      //     data,
      //     SuppelemtaryItems?.customer?.id,
      //     credentials,
      //   )
      //     .then((response) => {
      //       setIsLimit(response?.data?.max_limit / 100);
      //       setIsLimitGlobalVal(response?.data?.max_limit / 100);
      //       setFlexId(response?.data?.id);
      //     })
      //     .catch((e) => {
      //       dispatch(
      //         showToast({
      //           message: 'Failed to set the limits, Please try again later',
      //           style: 'error',
      //         }),
      //       );
      //       setIsCustomerFlexCreate(true);
      //       setLoading(false);
      //     });
      // }

      setLoading(false);
    }
  };

  const handleInputUpdate = async (ev) => {
    setBtnDisable(false);
    const val = parseFloat(ev.target.value.toString().replace(/,/g, ''));
    if (val > max_credit_limit) {
      dispatch(
        showToast({
          message: 'Limit cannot be set more than max credit limit',
          style: 'error',
        }),
      );
      ev.target.value = await parseFloat(isLimit).toFixed(2);
      setIsLimit(isLimit);
    } else {
      setIsLimit(val);
    }
  };

  const handleAccordionOpen = (e, i) => {
    setExpandAccordion(true);
  };

  const handleAccordionClose = (e, i) => {
    setExpandAccordion(false);
    setBtnDisable(true);
    setIsLimit(isLimitGlobalVal);
  };

  return (
    <section className="custom-acc">
      <Accordion
        className="spltry-accordian-cls"
        expanded={isCustomerFlexCreate ? false : expandAccordion}
        onClick={(e) => {
          if (!canUpdateLimits) return;
          handleAccordionOpen(e);
        }}
      >
        <AccordionSummary>
          <div style={{ width: '100%' }}>
            <div className="tw-flex tw-items-top tw-justify-between">
              <div className="accordion-summary-div">
                <div
                  style={{
                    marginTop: '-10px',
                  }}
                >
                  <div
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    <label className="splmtry-card-label">
                      Supplementary Card - 0{index + 1}
                    </label>
                  </div>
                  <div className="spltry-name-div">
                    <label className="spltry-name">
                      {SuppelemtaryItems?.customer?.printed_name}
                    </label>
                  </div>
                </div>
              </div>

              <div
                style={{
                  cursor: 'pointer',
                }}
              >
                {expandAccordion ? (
                  ''
                ) : isCustomerFlexCreate ? (
                  ''
                ) : isCustomerFlexUpdate ? (
                  ''
                ) : loading ? (
                  <div className="tw-flex-1 tw-mr-2 setlimt-input-supp">
                    <Loader />
                  </div>
                ) : (
                  <TextInput
                    type="currency"
                    name="setlimit"
                    value={isLimit}
                    sliderValue={isLimit}
                    size="Normal"
                    className="tw-flex-1 tw-mr-2 setlimt-input-supp"
                    variant="outlined"
                    style={mcInput}
                    readOnly={true}
                    disabled={!canUpdateLimits}
                    onChange={() => {}}
                  />
                )}

                {isCustomerFlexUpdate && btnDisable === true ? (
                  <MdRefresh
                    style={{ fontSize: '20px' }}
                    onClick={() => {
                      if (!canUpdateLimits) return;
                      UpdateCustomerFlexControlLimits();
                    }}
                  />
                ) : (
                  <>
                    {isCustomerFlexCreate ? (
                      loading ? (
                        <Loader />
                      ) : (
                        <MdRefresh
                          style={{ fontSize: '20px' }}
                          onClick={() => {
                            if (canUpdateLimits) {
                              setSupplyMentryReload(
                                SuppelemtaryItems?.customer?.id,
                              );
                              getCustomerFlexControlLimits();
                            }
                          }}
                        />
                      )
                    ) : (
                      expandAccordion && (
                        <>
                          {loading ? (
                            <Loader />
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                              }}
                            >
                              <TextInput
                                type="currency"
                                name="setlimit"
                                onChange={
                                  !canUpdateLimits
                                    ? () => {}
                                    : handleInputUpdate
                                }
                                value={isLimit}
                                sliderValue={isLimit}
                                size="Normal"
                                className="tw-flex-1 tw-mr-2 setlimt-input"
                                variant="outlined"
                                style={mcInput}
                                disabled={!canUpdateLimits}
                              />
                              <Button
                                onClick={
                                  !canUpdateLimits
                                    ? () => {}
                                    : handleLimitChange
                                }
                                text={'save'}
                                size="small"
                                className={`button button--save bg-pismo-yellow basis-0 grow-0 shrink sl-save-btn ${
                                  btnDisable || !canUpdateLimits
                                    ? 'button--disabled'
                                    : ''
                                }`}
                                disabled={btnDisable || !canUpdateLimits}
                              />
                            </div>
                          )}
                        </>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div
            style={{
              width: '100%',
              marginTop: '10px',
            }}
          >
            {!Mloading && !loading ? (
              <div className="slider-p-div">
                <div className="slider-val-div">
                  <div>0</div>
                  <div>
                    {Intl.NumberFormat('en-IN').format(max_credit_limit)}
                  </div>
                </div>
                <section className="slider-section">
                  <Slider
                    classes={{
                      thumb: classes.thumb,
                      rail: classes.rail,
                      track: classes.track,
                      mark: classes.mark,
                      markLabel: classes.markLabel,
                    }}
                    value={isLimit}
                    step={10}
                    marks={marks.map((l, i) => ({
                      label: l.label,
                      value: l.value,
                    }))}
                    min={0}
                    max={max_credit_limit}
                    onChange={(_, val) =>
                      !canUpdateLimits ? () => {} : handleSliderUpdate(val)
                    }
                  />
                </section>
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </AccordionDetails>
      </Accordion>
      <div
        className="indication-arrow"
        style={{
          textAlign: 'center',
        }}
      >
        {isCustomerFlexCreate ? (
          ''
        ) : expandAccordion ? (
          <BiChevronUp
            className="up chevroBtn"
            onClick={(e) => {
              handleAccordionClose(e);
            }}
          />
        ) : (
          <BiChevronUp
            className="down chevroBtn"
            onClick={(e) => {
              handleAccordionOpen(e);
            }}
          />
        )}
      </div>
    </section>
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
  injectIntl(SupplementaryLimitControls),
);
