import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { Alert, Button, TextField, View } from '@aws-amplify/ui-react';
import { CircularProgress, Grid, LinearProgress } from '@material-ui/core';

const REACT_APP_TOTP_URL = process.env.REACT_APP_TOTP_URL;

export default function MFASetup({ user, onSetErrorMessage, captchaEngine }) {
  const [code, setCode] = useState(null);
  const [totp, setTotp] = useState('');

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState({
    code: '',
    message: '',
    type: null,
  });
  useEffect(() => {
    setupTOTP();
  }, []);

  const setupTOTP = async () => {
    await Auth.setupTOTP(user)
      .then((code) => {
        setCode(code);
      })
      .catch((e) => {
        setErrorMessage((prev) => ({ ...prev, message: e?.message }));
      });
  };

  const onChange = (e) => {
    setTotp(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (totp.length !== 6) {
      setErrorMessage((prev) => ({
        ...prev,
        message: 'Code should be 6 Characters in Length',
      }));
      return;
    }
    setLoading(true);
    const verifyTotpTokenResult = await Auth.verifyTotpToken(user, totp).catch(
      (e) => {
        setErrorMessage((prev) => ({ ...prev, message: e?.message }));
      },
    );
    if (verifyTotpTokenResult) {
      await Auth.setPreferredMFA(user, 'TOTP').catch((e) => {
        setErrorMessage((prev) => ({ ...prev, message: e?.message }));
      });
    }
    setLoading(false);
  };

  if (!!!code) return <LinearProgress />;

  return (
    <div className="LoginP_container">
      <Grid item className="Login_box_MFA" direction="column">
        <Grid item container className="Forgot_label">
          <span>Setup TOTP</span>
        </Grid>
        <form onChange={onChange} onSubmit={onSubmit}>
          <View className="Login_siginIn">
            <>
              <Grid item container className="Login_pwd_container">
                <QRCode
                  value={`${String(REACT_APP_TOTP_URL).replace(
                    '{{KEY}}',
                    code,
                  )}`}
                  renderAs="canvas"
                  size={128}
                />
              </Grid>
              <Grid item container className="Qr_code_ctnr">
                <span className="Login_qr_code">{code}</span>
              </Grid>
              <Grid item container className="Login_pwd_container">
                <TextField
                  label="Code"
                  value={totp}
                  className="Login_input"
                  type="number"
                  autoComplete={false}
                  name="code"
                />
              </Grid>
            </>

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
