import { Auth } from 'aws-amplify';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import TimeOut from './TimeOut';
import { AdminGroups, timerNotAllowedHosts } from 'utils/coral/TenantConfig';

const timeoutLimit = process.env.REACT_APP_TIME_OUT; //10 Minutes

export default function TimeoutTimer({ hide }) {
  const [timer, setTimer] = useState('');
  const [open, setOpen] = useState(false);
  const intervalRef = useRef();
  const [isTimer, setIsTimer] = useState(null);

  useEffect(() => {
    const loggedInRole = sessionStorage.getItem('role');
    if (
      AdminGroups.includes(loggedInRole) &&
      timerNotAllowedHosts.includes(
        String(window.location.hostname).toLocaleLowerCase(),
      )
    ) {
      setIsTimer(true);
      return;
    } else setIsTimer(false);

    startTimer();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      if (isValidSession()) {
        let timeOutWithAfter10min = moment(localStorage.getItem('timeOut')).add(
          timeoutLimit,
          'milliseconds',
        );
        var mins = moment
          .utc(
            moment(timeOutWithAfter10min, 'HH:mm:ss').diff(
              moment(new Date(), 'HH:mm:ss'),
            ),
          )
          .format('mm:ss');
        setTimer(mins);
      }
    }, 1000);
  };

  React.useEffect(() => {
    if (Boolean(isTimer)) return;
    // if(process.env.ENVIRONMENT)
    if (process.env.NODE_ENV === 'development') return;
    const interval = setInterval(() => {
      if (isValidSession()) {
        let timeOutWithAfterNmin = moment(localStorage.getItem('timeOut')).add(
          timeoutLimit,
          'milliseconds',
        );
        var mins = moment
          .utc(
            moment(timeOutWithAfterNmin, 'HH:mm:ss').diff(
              moment(new Date(), 'HH:mm:ss'),
            ),
          )
          .format('mm:ss');
        setTimer(mins);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isValidSession = () => {
    let currentTime = moment();
    let timeOut = moment(localStorage.getItem('timeOut'));
    let timeOutWithAfter10min = moment(timeOut).add(
      timeoutLimit,
      'milliseconds',
    );
    if (!currentTime.isBetween(timeOut, timeOutWithAfter10min)) {
      clearInterval(intervalRef.current);
      setOpen(true);
      return false;
    }
    return true;
  };
  const keepMeLoggedIn = () => {
    setOpen(false);
    localStorage.removeItem('timeOut');
    localStorage.setItem('timeOut', new Date());
    startTimer();
  };

  if (Boolean(isTimer)) return <></>;

  return (
    <>
      <TimeOut open={open} setOpen={setOpen} keepMeLoggedIn={keepMeLoggedIn} />
      <div className={hide ? 'Timer_time' : 'Timer_time_hide'}>{timer}</div>;
    </>
  );
}
