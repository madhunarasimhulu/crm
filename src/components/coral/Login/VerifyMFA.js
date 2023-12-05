import { Alert, Button, TextField, View } from '@aws-amplify/ui-react';
import { CircularProgress, Grid } from '@material-ui/core';
import { Auth } from 'aws-amplify';
import React, { useState } from 'react';

export default function VerifyMFA({ user, onSetErrorMessage, captchaEngine }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    code: '',
    message: '',
    type: null,
  });

  const onChange = (e) => {
    setCode(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await Auth.confirmSignIn(user, code, user?.challengeName).catch((e) => {
      setErrorMessage((prev) => ({ ...prev, message: e?.message }));
    });
    setLoading(false);
  };

  return (
    <div className="LoginP_container">
      <Grid item className="Login_box" direction="column">
        <Grid item container className="Forgot_label">
          <span>Confirm TOTP Code</span>
        </Grid>
        <form onChange={onChange} onSubmit={onSubmit}>
          <View className="Login_siginIn">
            <Grid item container className="Login_pwd_container">
              <TextField
                label="Code"
                value={code}
                className="Login_input"
                type="number"
                autoComplete={false}
                name="code"
              />
            </Grid>

            <Grid item container className="Login_messageBox">
              {errorMessage?.message !== '' && (
                <Alert
                  width={'100%'}
                  variation={
                    errorMessage.type !== null ? errorMessage.type : 'error'
                  }
                  onDismiss={() => {
                    setErrorMessage({ code: '', message: '', type: null });
                  }}
                  isDismissible={true}
                  hasIcon={true}
                >
                  {errorMessage?.message}
                </Alert>
              )}
            </Grid>
            <Grid item container className="">
              <Button
                type="submit"
                className={loading ? 'Login_signIn_Loading' : 'Login_signIn'}
              >
                {loading && (
                  <>
                    <CircularProgress size={15} color="inherit" /> &nbsp;
                  </>
                )}{' '}
                <span>Confirm</span>
              </Button>
            </Grid>

            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              className="Login_signInContainer"
            >
              <label
                onClick={() => {
                  captchaEngine();
                }}
                className="Login_forgot_pwd"
              >
                Back To Sign In
              </label>
            </Grid>
          </View>
        </form>
      </Grid>
    </div>
  );
}
