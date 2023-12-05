import React from 'react';
import { Auth, Hub } from 'aws-amplify';
import { useState } from 'react';
import { useEffect } from 'react';
import './Auth.scss';
import { LinearProgress } from '@material-ui/core';
import Login from '../Login/Login';

export default function CustomAuthenticator({ children }) {
  const [status, setStatus] = useState(null);
  const [isAcHolderLoggedIn, setAcHolderLoggedIn] = useState(null);

  useEffect(() => {
    setAcHolderLoggedIn(sessionStorage.getItem('pismo-passport-token'));
    Auth.currentAuthenticatedUser({
      bypassCache: true,
    })
      .then((data) => setStatus('signIn'))
      .catch((err) => setStatus('signOut'));
    setStatus(status);
    Hub.listen('auth', (data) => {
      let events = ['signIn', 'signOut'];
      if (events.includes(data.payload.event)) setStatus(data.payload.event);
    });
  }, []);

  useState(() => {
    if (
      status !== 'signIn' &&
      isAcHolderLoggedIn !== true &&
      window.location.hash !== '#/'
    )
      window.history.pushState('', '/');
  }, [status]);

  if (status === null) return <LinearProgress />;

  if (status === 'signIn') return children;

  if (status === 'signOut') return <Login />;
  else
    return (
      <center>
        <h1>{status}</h1>
      </center>
    );
}
