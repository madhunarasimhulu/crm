import { Customers, Auth42CS } from 'clients';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import saveCustomerOnboardAccountData from 'actions/saveCustomerOnboardAccountData';
import AccountBlockedPopUp from 'components/AccountBlockedModal/AccountBlockedPopUp';
import { AppBar } from 'components';
import showBlockedModal from 'actions/showBlockedModal';

const TOKEN_REFRESH_INTERVAL = process.env.REACT_APP_REFRESH_API_INTERVAL; // 2 minutes

const handleTokenRequest = async () => {
  const documentNumber = sessionStorage.getItem('pismo-document-number');
  let response = {};

  try {
    response = await Auth42CS.refresh(documentNumber);
    if (response?.data) {
      const { account_id, token } = response.data;
      sessionStorage.removeItem('pismo-passport-token');
      sessionStorage.removeItem('pismo-account-id');
      sessionStorage.setItem('pismo-account-id', account_id);
      sessionStorage.setItem('pismo-passport-token', token);
    }
  } catch (error) {
    return error;
  }
};

const AppAuth = ({ children, onUpdate = () => {} }) => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const intervalRef = useRef();
  const [accountStatus, setAccountStatus] = useState('');
  const applicantAccepted = 'Accepted applicant'.toLowerCase();
  const { BlockedModal } = useSelector((state) => state);

  const fetchData = useCallback(async () => {
    const accountId = JSON.parse(
      JSON.stringify(sessionStorage.getItem('pismo-account-id')),
    );

    const token = JSON.parse(
      JSON.stringify(sessionStorage.getItem('pismo-passport-token')),
    );

    if (
      token === 'undefined' ||
      token === null ||
      accountId === 'undefined' ||
      accountId === null
    ) {
    } else {
      const { data: accCustomerData, error } = await Customers.getAccountStatus(
        accountId,
      );
      if (error) {
        throw error;
      }

      const {
        customer_id,
        email,
        org,
        status,
        status_reason_id,
        status_reason_description,
      } = accCustomerData;

      if (
        status === 'BLOCKED' &&
        String(status_reason_description).toLowerCase() ===
          String(applicantAccepted).toLowerCase() &&
        Number(status_reason_id) !==
          Number(process.env.REACT_APP_MAX_OTP_ATTEMPT_STATUS_REASON_ID)
      ) {
        dispatch(showBlockedModal(false));
        await dispatch(saveCustomerOnboardAccountData(accCustomerData));
        history.replace('/customer-onboard');
      } else if (status === 'NORMAL') {
        dispatch(showBlockedModal(false));
        sessionStorage.setItem('pismo-customer-id', customer_id);
        onUpdate({
          token: token,
          roles: ['account-holder', 'account-server', 'onboarding-server'],
          email: email,
          tenant: org,
          isCustomer: true,
          accounts: [
            {
              account: accountId,
              customer: customer_id,
            },
          ],
          status: status,
        });
      } else {
        sessionStorage.setItem('pismo-customer-id', customer_id);
        onUpdate({
          token: token,
          roles: ['account-holder', 'account-server', 'onboarding-server'],
          email: email,
          tenant: org,
          isCustomer: true,
          accounts: [
            {
              account: accountId,
              customer: customer_id,
            },
          ],
          status: status,
        });
        dispatch(showBlockedModal(true));
      }
    }
  }, [onUpdate]);

  useEffect(() => {
    // if ('serviceWorker' in navigator) return;
    (async () => {
      intervalRef.current = setInterval(
        () => handleTokenRequest(),
        process.env.REACT_APP_REFRESH_API_INTERVAL,
      );
    })();

    return () => {
      // if ('serviceWorker' in navigator) return;
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const sParams = new URLSearchParams(location.search);
    const sParamDocumentNumber = sParams.get('d');

    // if (sParamDocumentNumber) {
    //   sessionStorage.setItem('pismo-document-number', sParamDocumentNumber);
    // }

    (async () => {
      // await handleTokenRequest();

      await fetchData();
    })();
  }, [location.search, fetchData]);

  return (
    <>
      {BlockedModal?.showBlockedPopUp ? (
        <>
          <AccountBlockedPopUp accStatus={accountStatus} />
        </>
      ) : (
        ''
      )}
      {children}
    </>
  );
};

export default AppAuth;
