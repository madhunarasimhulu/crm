import { Auth } from 'aws-amplify';
import moment from 'moment';
import React, { useState } from 'react';
import { AdminGroups, timerNotAllowedHosts } from 'utils/coral/TenantConfig';

// adding time out

const timeoutLimit = process.env.REACT_APP_TIME_OUT; //10 Minutes

export default function TimeoutWrapper({ children }) {
  React.useEffect(() => {
    const loggedInRole = sessionStorage.getItem('role');

    if (
      AdminGroups.includes(loggedInRole) &&
      timerNotAllowedHosts.includes(
        String(window.location.hostname).toLocaleLowerCase(),
      )
    )
      return;

    //Cheking if user is already loggs in by using local Storage
    let timeOut = localStorage.getItem('timeOut');
    if (timeOut) verifyTimeOut();
    else localStorage.setItem('timeOut', new Date());
  }, []);

  const verifyTimeOut = () => {
    // Logic If timeout is already there check the time out is valid before 10 min then allow access otherwise Force logout and redirect to login page also clear the local storage
    let timeOut = moment(localStorage.getItem('timeOut'));
    let currentTime = moment();
    let timeOutWithAfter10min = moment(timeOut).add(
      timeoutLimit,
      'milliseconds',
    );
    timeOutWithAfter10min = moment(timeOutWithAfter10min).add(
      30 * 1000,
      'milliseconds',
    );

    if (!currentTime.isBetween(timeOut, timeOutWithAfter10min)) {
      Auth.signOut();
    }
  };

  return children;
}
