import React, { useEffect, useState } from 'react';
import './Login.scss';
import coralLogo from '../../../assets/img/coral/CoralIMGGroup.svg';
import CarolineLogo from '../../../assets/img/coral/CarolineLogo.png';
import { CircularProgress, Grid } from '@material-ui/core';
import {
  Alert,
  View,
  TextField,
  PasswordField,
  Button,
} from '@aws-amplify/ui-react';
import * as yup from 'yup';
import { Auth } from 'aws-amplify';
import { genErrors } from 'utils/coral/Validations';
import EmailIcon from '@material-ui/icons/MailOutline';
import HttpsIcon from '@material-ui/icons/HttpsOutlined';
import ReCAPTCHA from 'react-google-recaptcha';
import ForgotPassword from './ForgotPassword';
import NewPasswordRequired from './NewPasswordRequired';
import MFASetup from './MFASetup';
import VerifyMFA from './VerifyMFA';
import { name } from '../../../../package.json';
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from 'react-simple-captcha';

const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Email is required')
    .email('Email is invalid'),
  password: yup.string().required('Password is required'),
  captcha: yup
    .string()
    .required('Captcha is Required')
    .test('Captcha', 'Invalid Captcha please try again', (value) => {
      try {
        return validateCaptcha(value) == true;
      } catch (error) {
        return false;
      }
    }),
});

const initialState = {
  username: '',
  password: '',
  captcha: '',
};

export default function Login() {
  const [userData, setUserdata] = useState({
    ...initialState,
  });
  const [errors, setErrors] = useState({
    ...initialState,
  });
  const [errorMessage, setErrorMessage] = useState({ code: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [cognitoUser, setCogntioUser] = useState(null);
  const captchaRef = React.useRef();
  const [logo, setLogo] = useState(null);

  const onChange = (e) => {
    setUserdata({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value) => {
    setCaptcha(value);
    setErrorMessage({ code: '', message: '' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Validation check
    if (!(await validate())) return;
    // Captcha check
    if (validateCaptcha(userData.captcha) == false) {
      setUserdata((prev) => {
        return { ...prev, captcha: '' };
      });
      validateCaptcha(null);
      return;
    }
    setLoading(true);

    let user = await Auth.signIn(userData.username, userData.password, {
      recaptcha: captcha,
      source: name,
    }).catch((err) => {
      setErrorMessage({ code: err.code, message: err.message });
      return null;
    });
    setCogntioUser(user);
    if (user?.challengeName) {
      setErrorMessage({ code: user?.challengeName, message: '' });
    }
    setLoading(false);
    captchaRef?.current?.reset();
    resetCapthca();
  };

  const validate = async () => {
    let result = await genErrors(schema, userData, { ...initialState });
    if (!result.status) {
      setErrors(result.errors);
      return false;
    }
    setErrors({ ...initialState });
    return true;
  };

  useEffect(() => {
    if (errorMessage.code === 'PasswordResetRequiredException') resetCapthca();
  }, [errorMessage.code]);

  useEffect(() => {
    loadCaptchaEnginge(6);
    let config = {
      [process.env.REACT_CORAL_HOST]: coralLogo,
      [process.env.REACT_APP_CAROLINE_HOST]: CarolineLogo,
    };
    let logo = config[window.location.host];
    if (logo) setLogo(logo);
    else setLogo(coralLogo);
    return () => {
      setCaptcha(null);
    };
  }, []);

  const captchaEngine = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (errors.captcha !== '') resetCapthca();
  }, [errors.captcha]);

  const resetCapthca = () => {
    validateCaptcha(null);
    setUserdata((prev) => {
      return { ...prev, captcha: '' };
    });
  };

  if (errorMessage.code === 'NEW_PASSWORD_REQUIRED')
    return (
      <NewPasswordRequired
        onSetErrorMessage={setErrorMessage}
        oldPassword={userData.password}
        cognitoUser={cognitoUser}
        userDataProp={userData}
        setCogntioUser={setCogntioUser}
        captchaEngine={captchaEngine}
      />
    );
  if (errorMessage.code === 'PasswordResetRequiredException')
    return (
      <ForgotPassword
        onSetErrorMessage={setErrorMessage}
        captchaEngine={captchaEngine}
      />
    );

  if (errorMessage.code === 'MFA_SETUP')
    return (
      <MFASetup
        onSetErrorMessage={setErrorMessage}
        user={cognitoUser}
        captchaEngine={captchaEngine}
      />
    );

  if (errorMessage.code === 'SOFTWARE_TOKEN_MFA')
    return (
      <VerifyMFA
        onSetErrorMessage={setErrorMessage}
        user={cognitoUser}
        captchaEngine={captchaEngine}
      />
    );
  return (
    <div className="LoginP_container">
      <div className="LoginP_loginbox">
        <img src={logo} alt="coralLogo" />
        <div className="LoginP_box">
          <form onChange={onChange} onSubmit={onSubmit}>
            <View className="Login_siginIn">
              <Grid item container>
                <TextField
                  label="Email"
                  name="username"
                  value={userData.username}
                  autoFocus="true"
                  autoComplete="off"
                  aria-autocomplete="none"
                  className="Login_input"
                  innerStartComponent={
                    <div className="Login_input_innerStartComponent">
                      <EmailIcon />
                    </div>
                  }
                  type="text"
                  errorMessage={errors.username}
                  hasError={errors.username !== ''}
                />
              </Grid>
              <Grid item container className="Login_pwd_container">
                <PasswordField
                  label="Password"
                  value={userData.password}
                  className="Login_input"
                  autoComplete="off"
                  aria-autocomplete="none"
                  innerStartComponent={
                    <div className="Login_input_innerStartComponent">
                      <HttpsIcon />
                    </div>
                  }
                  name="password"
                  errorMessage={errors.password}
                  hasError={errors.password !== ''}
                />
              </Grid>

              <Grid item container className="Login_pwd_container">
                <TextField
                  label="Captcha"
                  name="captcha"
                  value={userData.captcha}
                  autoComplete="off"
                  aria-autocomplete="none"
                  className="Login_input"
                  type="text"
                  errorMessage={errors.captcha}
                  hasError={errors.captcha !== ''}
                />
              </Grid>
              <Grid
                item
                container
                direction="row"
                justifyContent="center"
                className="Login_signInContainer"
              >
                {/* <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={siteKey}
                  onChange={handleCaptchaChange}
                  onExpired={() => setCaptcha(null)}
                /> */}
                <div className="Login_Recaptcha">
                  <LoadCanvasTemplate />
                </div>
              </Grid>
              <Grid item container className="Login_messageBox">
                {errorMessage?.message !== '' && (
                  <Alert
                    width={'100%'}
                    variation="error"
                    onDismiss={() => {
                      setErrorMessage({ code: '', message: '' });
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
                  {loading ? (
                    <>
                      <CircularProgress size={15} color="inherit" /> &nbsp;{' '}
                      <span>Signing In</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
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
                    setErrorMessage({
                      code: 'PasswordResetRequiredException',
                      message: '',
                    });
                  }}
                  className="Login_forgot_pwd"
                >
                  Forgot Password
                </label>
              </Grid>
            </View>
          </form>
        </div>
      </div>
    </div>
  );
}
