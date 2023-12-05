import { Backdrop, CircularProgress } from '@material-ui/core';
import { showToast } from 'actions';
import { CoralAPI } from 'clients/coral';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import SearchBoxItem from './SearchBoxItem';

import { useHistory } from 'react-router-dom';
import { Customers } from 'clients';
import { AdminGroups } from 'utils/coral/TenantConfig';
import { createNewNote } from 'utils/coral/NotesUtil';
import { Auth } from 'aws-amplify';

export default function SearchDropBox({ data: customers }) {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  let showMessage = (message, style = 'error') =>
    dispatch(
      showToast({
        message,
        style,
      }),
    );

  const handleLogin = async ({
    account_id: accountId,
    document_number,
    customer_id: customerId,
  }) => {
    if (!accountId) return;
    setLoading(true);

    let clientId = localStorage.getItem('clientId');
    if (!clientId) return showMessage('Select Tenant to proceed');

    //using Account ID we are logging in and getting refresh Token
    CoralAPI.post(
      '/login',
      {
        accountId,
        document_number,
        customerId,
      },
      { headers: { 'x-client-id': clientId } },
    )
      .then(async ({ data }) => {
        sessionStorage.setItem('pismo-passport-token', data?.token);
        let canAccess = await checkIfVIP(accountId);
        setLoading(false);
        if (!canAccess) {
          sessionStorage.removeItem('pismo-passport-token');
          return;
        }
        //Preparing Data
        Login({
          account_id: accountId,
          document_number,
          token: data?.token,
          customerId,
        });
      })
      .catch((e) => {
        setLoading(false);
        showMessage('Unable to proceed please try after sometime');
      });
  };

  const checkIfVIP = async (accountId, token) => {
    let resp = await Customers.getAccountStatus(accountId).catch((e) => {
      return null;
    });
    //Rejecting if account status failed
    if (!resp) {
      showMessage('Unable to Get Account Details');
      return false;
    }

    // Converting CustomFields
    let customFields;

    try {
      if (!resp?.data?.custom_fields) customFields = {};
      else customFields = JSON.parse(resp.data.custom_fields);
    } catch (error) {
      customFields = {};
    }

    // Checking for VIP field "isVIP"
    // if there is no field present, then assuming that the user is not VIP
    if (!customFields.hasOwnProperty('isVIP')) return true;
    // If field present and user is not VIP then allowing the login
    if (customFields?.isVIP === 'FALSE') return true;
    // Now if customer is VIP and logged in operator is 42CsAdmin then allowing login otherwise rejecting with message
    let loggedInRole = sessionStorage.getItem('role');
    if (customFields?.isVIP === 'TRUE' && AdminGroups.includes(loggedInRole))
      return true;
    else {
      showMessage(
        'User is VIP customer and the call needs to be transferred to the supervisor',
      );
      return false;
    }
  };

  const Login = ({ document_number, account_id, token, customerId }) => {
    sessionStorage.setItem('pismo-customer-id', customerId);
    sessionStorage.setItem('pismo-document-number', document_number);
    sessionStorage.setItem('pismo-account-id', account_id);
    sessionStorage.setItem('pismo-passport-token', token);
    Auth.currentUserInfo().then(({ attributes }) => {
      createNewNote({
        newNote: `${attributes?.email} Logged in`,
      });
    });
    history.push(`/search/?d`);
  };

  return (
    <div
      style={{
        maxHeight: window.innerHeight * 0.4, //change here
        overflow: 'auto',
      }}
    >
      <Backdrop open={loading} style={{ zIndex: 999999 }}>
        <CircularProgress style={{ color: 'white' }} />
      </Backdrop>
      {customers?.map((customer, i) => {
        return (
          <div
            key={i}
            onClick={() => handleLogin(customer)}
            style={{ marginBottom: 2 }}
          >
            <SearchBoxItem customer={customer} index={i} />
          </div>
        );
      })}
    </div>
  );
}
