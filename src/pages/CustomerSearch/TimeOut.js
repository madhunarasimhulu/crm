import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
import './timer.scss';
import { Button, Dialog, DialogContent } from '@material-ui/core';

const timeoutLimit = process.env.REACT_APP_TIME_OUT; //10 Minutes

export default function TimeOut({ open, keepMeLoggedIn }) {
  const [timer, setTimer] = useState(null);
  const intervalRef = useRef();

  useEffect(() => {
    if (open === true) {
      startTimer();
    }
    return () => {
      setTimer(null);
      clearInterval(intervalRef.current);
    };
  }, [open]);

  useEffect(() => {
    if (String(timer) === '00') {
      clearInterval(intervalRef.current);
      Auth.signOut();
    }
  }, [timer]);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer(getRemainingTime());
    }, 1000);
  };

  const getRemainingTime = () => {
    let timeOutWithAfter10min = moment(localStorage.getItem('timeOut')).add(
      timeoutLimit,
      'milliseconds',
    );
    timeOutWithAfter10min = timeOutWithAfter10min.add(30 * 1000);
    var mins = moment
      .utc(
        moment(timeOutWithAfter10min, 'HH:mm:ss').diff(
          moment(new Date(), 'HH:mm:ss'),
        ),
      )
      .format('ss');
    return mins;
  };

  return (
    <Dialog open={open} className="timeout_dialog">
      <DialogContent>
        <div className="body">
          <div>
            <center>
              <h2>Are you still here?</h2>
            </center>
          </div>
          <div>
            <center>
              <label>
                Your session has been longer than 10mins, do you need more time?
                Otherwise your sessionm will end in 30seconds
              </label>
            </center>
          </div>
          <div>
            <center>
              <h1 className="timer-class">
                <span>00:</span>
                {timer || '00'}s
              </h1>
            </center>
          </div>
          <div>You will be logged out after the timer above ends.</div>
        </div>
        <div className="modl_ftr">
          <Button
            variant="contained"
            className="timer_btn_keep_me"
            size="large"
            sx={{ width: '100%' }}
            onClick={() => {
              clearInterval(intervalRef.current);
              keepMeLoggedIn();
            }}
          >
            Keep Me Logged In
          </Button>
          <Button
            color="primary"
            className="timer_btn_logout"
            variant="outlined"
            size="large"
            sx={{ width: '100%' }}
            onClick={() => {
              Auth.signOut();
            }}
          >
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
