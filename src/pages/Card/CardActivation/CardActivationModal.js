import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal, Box, Typography, IconButton } from '@material-ui/core';
import OtpBoxes from './OtpBoxes';
import AddressCard from './AddressCard';
import NewAddressVerForm from './NewAddressVerForm';
import SetPINcard from './setPINcard';
import SetTransChannelsCard from './setTransChannelsCard';
import { Button, Loader } from 'components/commons';
import CardVerfBoxes from './CardVerfBoxes';
import { MdClose } from 'react-icons/md';
import {
  BsFillExclamationCircleFill,
  BsInfoLg,
  BsFillExclamationTriangleFill,
} from 'react-icons/bs';
import { BiBlock } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { PCICards, Rules, Accounts } from 'clients';
import './CardActivation.scss';
import CardActivationDS from './CardActivationDS';
import { getRequestErrorMessage } from '../../../utils';
import { getAccountDetails, openAccountBlockedModal } from 'actions';
import EmailRegistration from './emailRegistration';

export default function CardActivationModal({
  handleUnblockSubmit,
  handleClose,
  open,
  cardId,
  last_4_digits,
  accountId,
  userDetails,
  userEmail,
}) {
  const history = useHistory();
  const selectedCardCustomerId = sessionStorage.getItem(
    'selectedCardCustomerId',
  );
  const {
    addresses,
    account: { account_status, status_reason_id },
    customerId: customerId,
  } = useSelector((state) => state.customer);
  const credentials = useSelector((state) => state.credentials);
  const dispatch = useDispatch();

  const [activeModal, setActiveModal] = useState('confirmation');
  // 'confirmation' 'addressVerf' 'success' 'newAddressVerf' 'cardDelivaryVerf' 'setPIN' 'setTransChannels' 'customerVerf' 'verfFailed' 'accBlocked'
  const [isBtnDisabled, setBtnDisabled] = useState(false);
  const [emailVerifySuccess, setEmailVerifySuccess] = useState(false);
  const [verfFailedPopUp, setVerfFailedPopUp] = useState(false);

  const initialOtpState = {
    num1: '',
    num2: '',
    num3: '',
    num4: '',
    num5: '',
    num6: '',
  };
  const initialCvvExpiryDateState = {
    num1: '',
    num2: '',
    num3: '',
    num4: '',
    num5: '',
    num6: '',
    num7: '',
  };
  const newInitialAddressState = {
    type: 'RESIDENTIAL',
    address: '',
    number: '',
    neighborhood: '',
    zip_code: '',
    city: '',
    state: '',
    country: 'INDIA',
    mailing_address: true,
    is_active: true,
  };
  const initialPinState = {
    initialPin: null,
    confirmPin: null,
  };
  const [otp, setOtp] = useState({ ...initialOtpState });
  const [cvvExpiryDate, setCvvExpiryDate] = useState({
    ...initialCvvExpiryDateState,
  });
  const [isCurrentResident, setIsCurrentResident] = useState(false);
  const [currentResAddress, setCurrentResAddress] = useState('');
  const [newAddress, setNewAddress] = useState({ ...newInitialAddressState });
  const [newAddressFormError, setNewAddressFormError] = useState(false);
  const [successDesc, setSuccessDesc] = useState('');
  const [pin, setPin] = useState({
    ...initialPinState,
  });

  const [errorMsg, setErrorMsg] = useState('');

  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    setClientId(sessionStorage.getItem('clientId'));
  }, []);

  useEffect(() => {
    if (emailVerifySuccess === true) {
      setActiveModal('emailRegVerify');
    }
  }, [emailVerifySuccess]);

  const handlePinChange = (event) => {
    setPin((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value.replace(/[^0-9]/g, ''),
      };
    });
  };

  const handleModalClose = () => {
    setActiveModal('confirmation');
    setOtp({ ...initialOtpState });
    setCvvExpiryDate({ ...initialCvvExpiryDateState });
    setIsCurrentResident(false);
    setCurrentResAddress('');
    setNewAddress({ ...newInitialAddressState });
    setErrorMsg('');
    setSuccessDesc('');
    setVerfFailedPopUp('');
    setNewAddressFormError(false);
    setPin({ ...initialPinState });
    handleClose();
  };

  const ValidateNewAddressForm = () => {
    const pattern = /^[A-Za-z0-9 ,/]+$/;
    const newAddressList = Object.values(newAddress);
    for (let item of newAddressList) {
      if (String(item).trim() === '') {
        setErrorMsg('All the fields are mandatory');
        setNewAddressFormError(true);
        return false;
      } else if (!pattern.test(item)) {
        setErrorMsg('No special characters are allowed except “,” and “/”');
        setNewAddressFormError(true);
        return false;
      }
    }
    setNewAddressFormError(false);
    return true;
  };

  const handleCvvExpiryDateChange = (event) => {
    if (event.target.value < 10) {
      setCvvExpiryDate((prevFormData) => {
        event.keyCode = 9;
        return {
          ...prevFormData,
          [event.target.name]: event.target.value,
        };
      });
    }
  };

  const handleNewAddressChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewAddress((prev) => {
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  const handleOtpChange = (event) => {
    if (event.target.value < 10) {
      setOtp((prevFormData) => {
        event.keyCode = 9;
        return {
          ...prevFormData,
          [event.target.name]: event.target.value,
        };
      });
    }
  };

  const handleEmailRegistration = () => {
    setActiveModal('emailRegistration');
  };

  const handleCnfCardTrue = () => {
    setActiveModal('cardDelivaryVerf');
  };

  const handleChangeAddress = () => {
    setActiveModal('newAddressVerf');
    setErrorMsg(
      'You will receive a verification call to confirm this new address.',
    );
  };

  const handleNewAddressSubmit = () => {
    const isValid = ValidateNewAddressForm();
    if (isValid) {
      setBtnDisabled(true);
      PCICards.changeCustomerPhysicalAddress({
        ...newAddress,
        complementary_address: newAddress.neighborhood,
        card_id: cardId,
      })
        .then(() => {
          setErrorMsg('');
          setSuccessDesc(CardActivationDS?.success?.saveAddressSuccessDesc);
          setActiveModal('success');
          setNewAddressFormError(false);
          setBtnDisabled(false);
        })
        .catch((error) => {
          setBtnDisabled(false);
          setNewAddressFormError(true);
          setErrorMsg(
            error?.response?.data?.msg || 'Change new address failed',
          );
        });
    }
  };

  const handleCardVerf = () => {
    const [cvvValue, expiryDateValue, cvvExpiryDateValue] = [
      cvvExpiryDate.num1 + cvvExpiryDate.num2 + cvvExpiryDate.num3,
      cvvExpiryDate.num4 +
        cvvExpiryDate.num5 +
        cvvExpiryDate.num6 +
        cvvExpiryDate.num7,
      Object.values(cvvExpiryDate)
        .reduce((a, b) => a + b)
        .trim(),
    ];
    if (cvvExpiryDateValue.length === 7) {
      const cardPciDetails = {
        cardid: cardId,
        cvv: cvvExpiryDateValue.slice(0, 3),
        expirydate:
          cvvExpiryDateValue.slice(5) + cvvExpiryDateValue.slice(3, 5),
      };
      setBtnDisabled(true);
      PCICards.verifyCardPciDetails(cardPciDetails)
        .then(() => {
          setErrorMsg('');
          setActiveModal('setPIN');
          setBtnDisabled(false);
        })
        .catch((error) => {
          setBtnDisabled(false);
          const MAX_LIMIT_TAKEN = 'maximum attempt taken';
          const CARD_VERIFICATION_FAILED_ERROR = 'card pci details mismatched';
          const errormsg =
            error?.response?.data?.msg || getRequestErrorMessage(error);
          if (errormsg === MAX_LIMIT_TAKEN) {
            setErrorMsg(
              MAX_LIMIT_TAKEN ||
                'card verfication request limit exceeded, please try after sometime',
            );
            setActiveModal('accBlocked');
          } else if (errormsg === CARD_VERIFICATION_FAILED_ERROR) {
            setErrorMsg(
              'Wrong CVV or Expiry Date entered please check and  try again',
            );
          } else {
            setErrorMsg(
              errormsg ||
                'Wrong CVV or Expiry Date entered please check and  try again',
            );
          }
        });
    } else if (cvvExpiryDateValue.trim() === '') {
      setErrorMsg('Please enter CVV and Expiry date');
    } else if (cvvValue.trim() === '') {
      setErrorMsg('Please enter CVV');
    } else if (expiryDateValue.trim() === '') {
      setErrorMsg('Please enter Expiry date');
    } else {
      setErrorMsg('Entered Invalid CVV / Expiry date');
    }
  };

  const handleCustomerVerfOtpSubmit = async () => {
    const otpValue = Object.values(otp)
      .reduce((a, b) => a + b)
      .trim();
    if (otpValue?.length === 6) {
      setBtnDisabled(true);
      const data = JSON.stringify({
        client: clientId,
        otptype: 'activateCard',
        otp: otpValue,
      });
      await PCICards.verifyAOtpCardActivation(data)
        .then(() => {
          handleUnblockSubmit();
          Accounts.getAccountCustomerList(accountId, credentials)
            .then((res) => {
              const is_ownerCustomerId = res?.items?.find(
                (e) => e?.customer?.is_owner === true,
              )?.customer?.id;
              if (is_ownerCustomerId == selectedCardCustomerId) {
                setActiveModal('setTransChannels');
              } else {
                setSuccessDesc(CardActivationDS?.success?.okWithDefaultTrans);
                setActiveModal('success');
              }
              setBtnDisabled(false);
              setErrorMsg('');
              setPin({ ...initialPinState });
            })
            .catch((error) => {
              setBtnDisabled(false);
              setErrorMsg(
                getRequestErrorMessage(error) ||
                  error?.response?.data?.msg ||
                  'failed fetching customerList details',
              );
            });
        })
        .catch((error) => {
          const OTP_MISMATCHED = 'otp mismatched';
          const MAX_LIMIT_TAKEN = 'maximum attempt taken';
          const OTP_MISMATCHED_ERROR = 'Wrong OTP Entered';
          const OTP_VERIFICATION_FAILED_ERROR = 'OTP verification failed';
          if (error?.response?.data?.msg === OTP_MISMATCHED) {
            setErrorMsg(OTP_MISMATCHED_ERROR);
          } else if (error?.response?.data?.msg === MAX_LIMIT_TAKEN) {
            setActiveModal('verfFailed');
            setErrorMsg('');
            setTimeout(async () => {
              await dispatch(getAccountDetails(accountId));

              if (
                account_status === 'BLOCKED' &&
                status_reason_id ===
                  Number(process.env.REACT_APP_MAX_OTP_ATTEMPT_STATUS_REASON_ID)
              ) {
                await dispatch(openAccountBlockedModal());
              }
              setTimeout(() => handleModalClose(), 2000);
            }, 10000);
          } else {
            setErrorMsg(OTP_VERIFICATION_FAILED_ERROR);
          }
          setBtnDisabled(false);
        });
    } else {
      setErrorMsg('Please Enter 6 Digit OTP');
    }
  };

  const handleSetPINsubmit = async () => {
    if (pin?.confirmPin?.length === 4 && pin?.initialPin?.length === 4) {
      if (pin?.confirmPin === pin?.initialPin) {
        setBtnDisabled(true);
        await PCICards.updateCardPassword(cardId, pin.confirmPin, credentials)
          .then(async () => {
            const data = {
              client: clientId,
              otptype: 'activateCard',
              cclastdigit: last_4_digits,
            };
            PCICards.generateOtpCardActivation(data)
              .then(() => {
                setActiveModal('customerVerf');
                setErrorMsg('');
                setBtnDisabled(false);
              })
              .catch((error) => {
                setBtnDisabled(false);

                setErrorMsg(
                  error?.response?.data?.msg ||
                    'OTP Genaration for card activation is failed, Please try after some time',
                );
              });
          })
          .catch((error) => {
            setBtnDisabled(false);
            setErrorMsg(
              getRequestErrorMessage(error) ||
                error?.response?.data?.msg ||
                'failed while setting card pin',
            );
          });
      } else {
        setErrorMsg('Entered PIN does not match, please check and try again.');
      }
    } else if (
      (pin?.confirmPin === null || pin?.confirmPin?.length === 0) &&
      pin?.initialPin?.length === 4
    ) {
      setErrorMsg('Please re-enter 4 digit PIN.');
    } else {
      setErrorMsg('Please enter 4 digit PIN.');
    }
  };

  const handleDefaultTransChannels = () => {
    // spending limit api calls
    setBtnDisabled(true);
    const channals = [
      'ECOMMERCE_RESTRICTION',
      'POS_CHIP_RESTRICTION',
      'POS_NFC_RESTRICTION',
      'ATM_RESTRICTION',
    ];
    Promise.all(
      channals.map((spendingLimitId) =>
        Rules.removeSpendingLimitRestriction(
          spendingLimitId,
          credentials,
        ).catch((error) =>
          setErrorMsg(
            getRequestErrorMessage(error) ||
              error?.response?.data?.msg ||
              'something went wrong',
          ),
        ),
      ),
    )
      .then((results) => {
        const dayCloseCycle = process.env.REACT_APP_DAY_RESET_SPENDING_LIMIT;
        Rules.addSpendingLimitValue(
          'pos_nfc',
          Number(process.env.REACT_APP_RBI_LIMIT_FOR_POS_NFC),
          dayCloseCycle,
          credentials,
        )
          .then(() => {
            setErrorMsg('');

            setSuccessDesc(CardActivationDS?.success?.okWithDefaultTrans);
            setActiveModal('success');
            setBtnDisabled(false);
          })
          .catch((error) => {
            setErrorMsg(
              getRequestErrorMessage(error) ||
                error?.response?.data?.msg ||
                'setting default limit for pos_nfc failed, please try again',
            );
            setBtnDisabled(false);
          });
      })
      .catch((error) => {
        setErrorMsg(
          getRequestErrorMessage(error) ||
            error?.response?.data?.msg ||
            'Error in promises:',
        );
        setBtnDisabled(false);
      });
  };

  const handleNoDefaultTransChannels = () => {
    history.replace(
      `/customers/${customerId}/accounts/${accountId}/profile/spending-limits`,
    );
  };

  const handleNoCardClick = () => {
    for (let address of addresses) {
      setBtnDisabled(true);
      if (address?.active) {
        const resAddress =
          address?.address +
          ', ' +
          address?.city +
          ', ' +
          address?.state +
          ', ' +
          address?.country +
          ', ' +
          address?.zipcode;
        setCurrentResAddress(resAddress);
        setActiveModal('addressVerf');
        setErrorMsg('');
        setBtnDisabled(false);
        break;
      }
    }
    if (addresses?.find((address) => address.active === true) === undefined) {
      setActiveModal('newAddressVerf');
      setErrorMsg(
        'You will receive a verification call to confirm this new address.',
      );
      setBtnDisabled(false);
    }
  };

  const handleSubBtnClick = () => {
    if (activeModal === 'confirmation') {
      handleNoCardClick();
    } else if (activeModal === 'addressVerf' && isCurrentResident) {
      setSuccessDesc(CardActivationDS?.success?.addressVerfSuccessDesc);
      setActiveModal('success');
      setErrorMsg('');
    } else if (activeModal === 'addressVerf' && !isCurrentResident) {
      setErrorMsg('Please confirm the address to proceed');
    } else if (activeModal === 'setTransChannels') {
      handleNoDefaultTransChannels();
    }
  };

  const handleEmailVerify = () => {
    setActiveModal('cardDelivaryVerf');
  };

  useEffect(() => {
    if (verfFailedPopUp === true) {
      setActiveModal('verfFailed');
    }
  }, [verfFailedPopUp]);

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="card-activation-modal"
      >
        <div className="card-activation-container card-activation-scroll">
          <Box sx={{ position: 'relative' }}>
            <Typography
              variant={
                activeModal === 'verfFailed' || activeModal === 'accBlocked'
                  ? 'h4'
                  : 'h5'
              }
              className={`card-activation-title ${
                activeModal === 'verfFailed' || activeModal === 'accBlocked'
                  ? 'card-activation-title-lg'
                  : null
              }`}
            >
              <center>
                {activeModal === 'confirmation'
                  ? CardActivationDS?.confirmation?.title
                  : activeModal === 'emailRegistration' ||
                    activeModal === 'emailRegVerify'
                  ? CardActivationDS?.emailReg?.title
                  : activeModal === 'addressVerf'
                  ? CardActivationDS?.addressVerf?.title
                  : activeModal === 'newAddressVerf'
                  ? CardActivationDS?.newAddressVerf?.title
                  : activeModal === 'success'
                  ? CardActivationDS?.success?.title
                  : activeModal === 'setPIN'
                  ? CardActivationDS?.setPIN?.title
                  : activeModal === 'setTransChannels'
                  ? CardActivationDS?.setTransChannels?.title
                  : activeModal === 'cardDelivaryVerf'
                  ? CardActivationDS?.cardDelivaryVerf?.title
                  : activeModal === 'customerVerf'
                  ? CardActivationDS?.customerVerf?.title
                  : activeModal === 'verfFailed'
                  ? CardActivationDS?.verfFailed?.title
                  : activeModal === 'accBlocked'
                  ? CardActivationDS?.accBlocked?.title
                  : ''}
              </center>
            </Typography>

            <IconButton onClick={handleModalClose} className="modal-close-btn">
              <MdClose />
            </IconButton>
          </Box>
          <Box sx={{ margin: '0px 40px' }}>
            <Typography component="p" className="modalText">
              {activeModal === 'addressVerf'
                ? CardActivationDS?.addressVerf?.desc
                : activeModal === 'newAddressVerf'
                ? CardActivationDS?.newAddressVerf?.desc
                : activeModal === 'cardDelivaryVerf'
                ? CardActivationDS?.cardDelivaryVerf?.desc
                : activeModal === 'customerVerf'
                ? CardActivationDS?.customerVerf?.desc
                : ''}
            </Typography>
            <Box>
              {(activeModal === 'confirmation' ||
                activeModal === 'accBlocked' ||
                activeModal === 'verfFailed' ||
                activeModal === 'success') && (
                <div>
                  <Typography
                    variant="h6"
                    component="h6"
                    className="modalTextLTC"
                  >
                    {activeModal === 'confirmation'
                      ? CardActivationDS?.confirmation?.desc
                      : activeModal === 'success'
                      ? successDesc
                      : activeModal === 'accBlocked'
                      ? CardActivationDS?.accBlocked?.desc
                      : activeModal === 'verfFailed'
                      ? CardActivationDS?.verfFailed?.desc
                      : ''}
                  </Typography>
                  <center>
                    {activeModal === 'verfFailed' ? (
                      <BiBlock style={{ color: 'red', fontSize: '65px' }} />
                    ) : activeModal === 'accBlocked' ? (
                      <BsFillExclamationTriangleFill
                        style={{ color: 'red', fontSize: '65px' }}
                      />
                    ) : (
                      ''
                    )}
                  </center>
                </div>
              )}

              {(activeModal === 'emailRegistration' ||
                activeModal === 'emailRegVerify') && (
                <EmailRegistration
                  account_status={account_status}
                  status_reason_id={status_reason_id}
                  disabled={errorMsg === 'maximum attempt taken'}
                  setEmailVerifySuccess={setEmailVerifySuccess}
                  setVerfFailedPopUp={setVerfFailedPopUp}
                  accountId={accountId}
                  handleModalClose={handleModalClose}
                />
              )}

              {activeModal === 'customerVerf' && (
                <OtpBoxes
                  otp={otp}
                  handleOtpChange={handleOtpChange}
                  disabled={errorMsg === 'maximum attempt taken'}
                />
              )}
              {activeModal === 'addressVerf' && (
                <AddressCard
                  isCurrentResident={isCurrentResident}
                  currentResAddress={currentResAddress}
                  onChangeHandle={() =>
                    setIsCurrentResident(!isCurrentResident)
                  }
                />
              )}
              {activeModal === 'newAddressVerf' && (
                <NewAddressVerForm
                  newAddress={newAddress}
                  handleNewAddressChange={handleNewAddressChange}
                />
              )}
              {activeModal === 'cardDelivaryVerf' && (
                <CardVerfBoxes
                  cvvExpiryDate={cvvExpiryDate}
                  handleCvvExpiryDateChange={handleCvvExpiryDateChange}
                  disabled={errorMsg === 'maximum attempt taken'}
                />
              )}
              {activeModal === 'setPIN' && (
                <SetPINcard pin={pin} handlePinChange={handlePinChange} />
              )}
              {activeModal === 'setTransChannels' && <SetTransChannelsCard />}
            </Box>
          </Box>
          <Box
            sx={{
              paddingTop: '1.6rem',
              position: 'relative',
              marginTop:
                activeModal != 'emailRegistration' ? '2.6rem' : '0.1rem',
            }}
          >
            <Box
              sx={{
                color:
                  activeModal === 'newAddressVerf' && !newAddressFormError
                    ? '#777777'
                    : 'red',
                position: 'absolute',
                left: '0%',
                right: '0%',
                top: '-28%',
                margin: '0px 30px',
              }}
            >
              <center>
                {!newAddressFormError && activeModal === 'newAddressVerf' && (
                  <BsInfoLg />
                )}
                {errorMsg !== '' && newAddressFormError && (
                  <BsFillExclamationCircleFill />
                )}
                {errorMsg !== '' && activeModal !== 'newAddressVerf' && (
                  <BsFillExclamationCircleFill />
                )}
                <span style={{ paddingLeft: '16px' }}>{errorMsg}</span>
              </center>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Button
                className={
                  errorMsg === 'maximum attempt taken' ||
                  isBtnDisabled ||
                  (activeModal === 'customerVerf' &&
                    Object.values(otp)
                      .reduce((a, b) => a + b)
                      .trim().length !== 6)
                    ? 'btn-blocked'
                    : activeModal != 'emailRegistration'
                    ? 'btn-theme'
                    : 'noclass'
                }
                text={
                  isBtnDisabled ? (
                    <Loader size="large" />
                  ) : activeModal === 'confirmation' ? (
                    CardActivationDS?.confirmation?.btn?.mainText
                  ) : activeModal === 'addressVerf' ? (
                    CardActivationDS?.addressVerf?.btn?.mainText
                  ) : activeModal === 'newAddressVerf' ? (
                    CardActivationDS?.newAddressVerf?.btn?.mainText
                  ) : activeModal === 'success' ? (
                    CardActivationDS?.success?.btn?.mainText
                  ) : activeModal === 'cardDelivaryVerf' ? (
                    CardActivationDS?.cardDelivaryVerf?.btn?.mainText
                  ) : activeModal === 'setPIN' ? (
                    CardActivationDS?.setPIN?.btn?.mainText
                  ) : activeModal === 'customerVerf' ? (
                    CardActivationDS?.customerVerf?.btn?.mainText
                  ) : activeModal === 'setTransChannels' ? (
                    CardActivationDS?.setTransChannels?.btn?.mainText
                  ) : activeModal === 'verfFailed' ? (
                    CardActivationDS?.verfFailed?.btn?.mainText
                  ) : activeModal === 'accBlocked' ? (
                    CardActivationDS?.accBlocked?.btn?.mainText
                  ) : activeModal === 'emailRegVerify' ? (
                    CardActivationDS?.emailReg?.btn?.mainText
                  ) : (
                    ''
                  )
                }
                type="button"
                disabled={
                  errorMsg === 'maximum attempt taken' ||
                  isBtnDisabled ||
                  (activeModal === 'customerVerf' &&
                    Object.values(otp)
                      .reduce((a, b) => a + b)
                      .trim().length !== 6)
                }
                // emailRegVerify
                onClick={
                  activeModal === 'confirmation'
                    ? // userEmail === '' ||
                      //   String(userEmail).toLocaleLowerCase() == 'ask@42cards.in'
                      //   ? handleEmailRegistration
                      //   :
                      handleCnfCardTrue
                    : activeModal === 'addressVerf'
                    ? handleChangeAddress
                    : activeModal === 'newAddressVerf'
                    ? handleNewAddressSubmit
                    : activeModal === 'emailRegVerify'
                    ? handleEmailVerify
                    : activeModal === 'setPIN'
                    ? handleSetPINsubmit
                    : activeModal === 'cardDelivaryVerf'
                    ? handleCardVerf
                    : activeModal === 'customerVerf'
                    ? handleCustomerVerfOtpSubmit
                    : activeModal === 'setTransChannels'
                    ? handleDefaultTransChannels
                    : activeModal === 'accBlocked' ||
                      activeModal === 'verfFailed' ||
                      activeModal === 'success'
                    ? handleModalClose
                    : null
                }
              />

              {(activeModal === 'confirmation' ||
                activeModal === 'addressVerf' ||
                activeModal === 'setTransChannels') && (
                <Button
                  onClick={handleSubBtnClick}
                  className={
                    errorMsg === 'maximum attempt taken' ||
                    isBtnDisabled ||
                    (activeModal === 'customerVerf' &&
                      Object.values(otp)
                        .reduce((a, b) => a + b)
                        .trim().length !== 6) ||
                    (activeModal === 'addressVerf' && !isCurrentResident)
                      ? 'btn-outlined-blocked'
                      : 'btn-outlined-active'
                  }
                  disabled={isBtnDisabled}
                  text={
                    activeModal === 'confirmation'
                      ? CardActivationDS?.confirmation?.btn?.subText
                      : activeModal === 'addressVerf'
                      ? CardActivationDS?.addressVerf?.btn?.subText
                      : activeModal === 'setTransChannels'
                      ? CardActivationDS?.setTransChannels?.btn?.subText
                      : ''
                  }
                />
              )}
            </Box>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
