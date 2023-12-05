import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import { getBaseAPIURL } from '../../utils';
import axios from 'axios';
import setup from '../../clients/setup';
import { useForm } from 'react-hook-form';
import { Auth42CS } from 'clients';
import { FormattedMessage } from 'react-intl';
import './Splash.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setClientId } from 'actions';
import submitCustomerOnboardData from 'actions/submitOnboardData';
import { onBoardingConfig } from '../../utils/onBoarding/OnboardingConfig';
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import saveCustomerOnboardAccountData from 'actions/saveCustomerOnboardAccountData';
import { Welcome } from 'pages/CustomerOnboard/Welcome';
import { CustomerOnBoard } from 'pages/CustomerOnboard';
// import '../CustomerOnboard/CustomerOnboard.scss';

const baseURL = getBaseAPIURL();

export const client = setup(
  axios.create({
    baseURL: `${baseURL}/passport`,
  }),
);

const SplashPage = () => {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  // const usersCollectionRef = collection(db, '42cards');
  let history = useHistory();

  const { isLoading, data, clientId } = useSelector((state) => state.onBoard);
  const [appError, setAppError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userNotFound, setUserNotFound] = useState(false);
  const [userAppInProgress, setUserAppInProgress] = useState(false);
  const [clientIdError, setClientIdError] = useState(false);
  const [isAgreeTandC, setIsAgreeTandC] = useState(false);
  const [isTandCalert, setIsTandCalert] = useState(false);
  const [isUserExist, setIsUserExist] = useState(false);

  const [id, setId] = useState('');
  useEffect(() => {
    window.addEventListener('keyup', keyUpHandler);

    return () => window.removeEventListener('keyup', keyUpHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyUpHandler = (e) => {
    // if (e.key.match(/enter/gi)) {
    //   //   onClick();
    // }
  };

  const onTextEnter = async (e) => {
    // setAppError(false);
  };
  useEffect(() => {
    const sParams = new URLSearchParams(location.search.replace(/\+/g, '%2B'));
    const encReq = sParams.get('encReq');
    const client_id = sParams.get('clientId');
    let jwt = sParams.get('JWT');

    (async () => {
      const loginData = client_id
        ? {
            clientId: client_id,
            encReq: encReq,
          }
        : {
            encReq: encReq,
          };
      // Validation: if clientId is CL_00UTKB
      if (client_id === onBoardingConfig.CL_00UTKB.code) {
        if (!!!jwt || jwt === '') {
          setAppError(true);
          setErrorMessage('Invalid JWT');
          return;
        }
      }
      await handleSignIn(loginData, jwt);
    })();
  }, [location.search]);

  const handleSignIn = async (loginData, JWT) => {
    //Checking if ClientId is available in Config or not

    if (loginData?.clientId) {
      let error = !Object.keys(onBoardingConfig).includes(loginData?.clientId);
      setClientIdError(error);
      if (error) return;
    }

    //Setting Default ClientId as CUB if clientId dosen't set
    loginData['clientId'] = loginData?.clientId
      ? loginData.clientId
      : onBoardingConfig['CL_000CUB'].code;

    // //add session storage item with clientId using loginData.clientId if present and not null, otherwise use default value of 42cards
    sessionStorage.setItem('clientId', loginData['clientId']);
    dispatch(setClientId(loginData['clientId']));

    loginData.clientId =
      process.env.NODE_ENV === 'development' ? 'sleeve' : loginData.clientId;

    Auth42CS.login(loginData, JWT)
      .then((response) => {
        if (response?.data) {
          const { account_id, token, document_number } = response.data;
          sessionStorage.setItem('pismo-document-number', document_number);
          sessionStorage.setItem('pismo-account-id', account_id);
          sessionStorage.setItem('pismo-passport-token', token);
          history.push(`/search/?d`);
          // initiateServiceWorker();
        }
      })
      .catch((error) => {
        const USER_DOESNOT_EXIST = 'USER_DOESNOT_EXIST';
        const APPLICATION_IN_PROGRESS = 'APPLICATION_IN_PROGRESS';
        const REDIRECT_CUSTOMER_CONSENT = 'REDIRECT_CUSTOMERS_CONSENT';
        const CUSTOMER_CONSENT_EXIST = 'CUSTOMERS_CONSENT_EXIST';
        if (error) {
          if (error?.response?.data?.msg === USER_DOESNOT_EXIST) {
            setUserNotFound(true);
            setId(error?.response?.data?.document_number);
            sessionStorage.setItem(
              'pismo-passport-token',
              error?.response?.data?.token,
            );
          } else if (error?.response?.data?.msg === APPLICATION_IN_PROGRESS) {
            setUserAppInProgress(true);
          } else if (error?.response?.data?.msg === REDIRECT_CUSTOMER_CONSENT) {
            const { cclimit, token, document_number } = error?.response?.data;
            sessionStorage.setItem('pismo-passport-token', token);
            sessionStorage.setItem('pismo-document-number', document_number);
            const data = {
              max_credit_limit: cclimit,
            };
            dispatch(saveCustomerOnboardAccountData(data));
            history.replace('/customer-onboard');
          } else if (error?.response?.data?.msg === CUSTOMER_CONSENT_EXIST) {
            setIsUserExist(true);
          } else {
            setAppError(true);
            setErrorMessage(error?.message);
          }
        }
      });
  };

  // const initiateServiceWorker = () => {
  //   if ('serviceWorker' in navigator) {
  //     let res;
  //     // Getting all service Worker's and de-registring all before loading
  //     navigator.serviceWorker.getRegistrations().then((registrations) => {
  //       for (let registration of registrations) {
  //         registration.unregister();
  //       }
  //       navigator.serviceWorker.register('/service-worker.js');
  //       navigator.serviceWorker.ready.then(async (registration) => {
  //         res = registration;
  //         let document_number = sessionStorage.getItem('pismo-document-number');
  //         let token = sessionStorage.getItem('pismo-passport-token');
  //         registration.active.postMessage({
  //           type: 'start',
  //           document_number,
  //           refToken: token,
  //           base_url: process.env.REACT_APP_42CS_AUTH_URL,
  //           refreshTime: process.env.REACT_APP_REFRESH_API_INTERVAL,
  //         });
  //       });
  //     });
  //     navigator.serviceWorker.addEventListener('message', (event) => {
  //       if (event?.data?.data) {
  //         // Do something with the message data
  //         const { account_id, token } = event.data?.data;
  //         sessionStorage.removeItem('pismo-passport-token');
  //         sessionStorage.removeItem('pismo-account-id');
  //         sessionStorage.setItem('pismo-account-id', account_id);
  //         sessionStorage.setItem('pismo-passport-token', token);
  //       }
  //       if (event?.data?.getToken) {
  //         sessionStorage.setItem('pismo-passport-token', event?.data?.getToken);
  //       }
  //     });

  //     // Adding Window Listners
  //     window.addEventListener('beforeunload', () => {
  //       navigator.serviceWorker.unregister();
  //     });
  //     document.addEventListener('visibilitychange', () => {
  //       if (document?.hidden) return;
  //       res.active.postMessage({
  //         type: 'getToken',
  //       });
  //     });
  //   } else {
  //     console.log('service worker is not Found');
  //   }
  // };

  const handleClick = () => {
    isAgreeTandC
      ? dispatch(
          submitCustomerOnboardData({
            documentId: id,
            client: clientId,
          }),
        )
      : setIsTandCalert(true);
  };

  const handleTandCalert = () => {
    isAgreeTandC ? setIsTandCalert(true) : setIsTandCalert(false);
  };
  const handleCheckbox = async () => {
    await handleTandCalert();
    setIsAgreeTandC((prev) => !prev);
  };
  const handleTandCclick = () => {
    window.open(
      String(onBoardingConfig[clientId]?.terms_conditions_pdf_url),
      '_blank',
    );
  };
  useEffect(() => {
    if (data?.success) {
      setUserAppInProgress(true);
    }
  }, [data]);

  if (clientIdError) return <>Invalid Client ID</>;

  return (
    <>
      {appError ? (
        <>
          <p>{errorMessage}</p>
        </>
      ) : userNotFound || userAppInProgress ? (
        <section className="splash-root">
          <div className="splash-wrapper">
            <section className="splash-content">
              {userAppInProgress ? (
                <div className="splash-page-sub-title">
                  {onBoardingConfig[clientId]?.code === 'CL_00UTKB' ? (
                    <div style={{ paddingBottom: '70px' }}>
                      <FormattedMessage id={`Thank you for applying!`} />
                    </div>
                  ) : (
                    <FormattedMessage id={`Thank you for applying for a`} />
                  )}
                </div>
              ) : (
                <>
                  <div className="spalsh-page-title">
                    <FormattedMessage id={`No Active  Cards Present`} />
                  </div>

                  <div className="splash-page-text">
                    <FormattedMessage
                      id={`Would you like to know more about`}
                    />
                  </div>
                </>
              )}
              <div className="splash-page-img-container">
                <img
                  src={onBoardingConfig[clientId]?.logo?.default}
                  alt="banner-img"
                  className="splash-banner-img"
                />
              </div>
              <div className="splash-card-name">
                {onBoardingConfig[clientId]?.code === 'CL_00UTKB' ? (
                  <></>
                ) : (
                  <FormattedMessage id={`Credit Card`} />
                )}
              </div>
              {userAppInProgress ? (
                <div
                  className="splash-review-text"
                  style={{
                    textAlign: 'center!important',
                    paddingLeft: window.innerWidth * 0.01,
                    paddingTop: 100,
                  }}
                >
                  {onBoardingConfig[clientId]?.code === 'CL_00UTKB' ? (
                    <p>
                      Dear Customer,
                      <br />
                      Your application for Utkarsh Bank Credit Card is under
                      review,
                      <br />
                      You will be notified based on your eligibility.
                    </p>
                  ) : (
                    <p>
                      Dear Customer,
                      <br />
                      Your application for DHI CUB Credit Card is under review.
                      <br />
                      You will be notified if you are eligible for a DHI CUB
                      Credit Card.
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {' '}
                  <div>
                    <div className="splash-btn-container">
                      <button
                        type="button"
                        className="splash-page-button"
                        disabled={isLoading}
                        onClick={handleClick}
                      >
                        <FormattedMessage id={`Yes, I am interested`} />
                      </button>
                    </div>
                    <div className="splash-page-TandC-container">
                      <input
                        type="checkbox"
                        checked={isAgreeTandC}
                        onChange={handleCheckbox}
                        className="splash-page-TandC-checkbox"
                      />
                      <p>
                        I have read the{' '}
                        <span
                          onClick={handleTandCclick}
                          className="splash-page-TandC"
                        >
                          Terms and Conditions
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="splash-page-TandC-error-msg">
                        {isTandCalert ? (
                          <>
                            <BsFillExclamationCircleFill />
                            <span>
                              Please agree to the Terms and Conditions to
                              Proceed
                            </span>
                          </>
                        ) : null}
                      </label>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </section>
      ) : (
        <>
          {isUserExist ? (
            <section className="onboard-root">
              <div className="onboard-wrapper">
                <Welcome onBoardingConfig={onBoardingConfig?.[clientId]} />
              </div>
            </section>
          ) : (
            ''
          )}
        </>
      )}
    </>
  );
};

export default SplashPage;
