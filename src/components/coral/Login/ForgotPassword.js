import {
  View,
  TextField,
  Alert,
  Button,
  PasswordField,
} from '@aws-amplify/ui-react';
import { CircularProgress, Grid } from '@material-ui/core';
import * as yup from 'yup';
import { genErrors } from 'utils/coral/Validations';
import { useState } from 'react';
import { Auth } from 'aws-amplify';
import EmailIcon from '@material-ui/icons/MailOutline';

const EmailSchema = yup.object().shape({
  username: yup
    .string()
    .required('Email is required')
    .email('Email is invalid'),
});

const forgotPwdSchema = yup.object().shape({
  username: yup
    .string()
    .required('Email is required')
    .email('Email is invalid'),
  code: yup
    .number()
    .typeError('Code Should be a Number')
    .required('Code is required'),
  newPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Password should be atleast 8 characters')
    .max(40, 'Password should be atmost 40 characters'),
  confirmPassword: yup.string().required('Confirm Password is required'),
});

const initialState = {
  username: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
};

const stages = {
  RESET_PASSWORD: 'RESET_PASSWORD',
  CONFIRM_PASSWORD: 'CONFIRM_PASSWORD',
};

export default function ForgotPassword({ onSetErrorMessage, captchaEngine }) {
  const [userData, setUserdata] = useState({
    ...initialState,
  });
  const [errors, setErrors] = useState({
    ...initialState,
  });
  const [stage, setStage] = useState(stages.RESET_PASSWORD);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState({
    code: '',
    message: '',
    type: null,
  });

  const onChange = (e) => {
    setUserdata({ ...userData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Validation check
    if (!(await validate())) return;
    // Doing This validation because of yup is not supporting test.
    // Validating if password & Confirm password is same
    if (userData.confirmPassword !== userData.newPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Password Should Match',
      }));
      return;
    }
    //
    // Captcha check
    if (stage === stages.RESET_PASSWORD) forgotPassword();
    else if (stage === stages.CONFIRM_PASSWORD) forgotPasswordSubmit();
  };

  const forgotPassword = async () => {
    setLoading(true);
    let result = await Auth.forgotPassword(userData.username).catch((err) => {
      setErrorMessage({ code: err.code, message: err.message });
    });
    if (result) {
      setStage(stages.CONFIRM_PASSWORD);
      setErrorMessage({
        code: '',
        message: 'The Code has been sent on your registered email',
        validate: 'success',
      });
    }
    setLoading(false);
  };

  const forgotPasswordSubmit = async () => {
    setLoading(true);
    let result = await Auth.forgotPasswordSubmit(
      userData.username,
      userData.code,
      userData.newPassword,
    ).catch((err) => {
      setErrorMessage({ code: err.code, message: err.message });
    });
    if (result) onSetErrorMessage({ code: '', message: '' });
    setLoading(false);
  };

  const validate = async () => {
    let result = await genErrors(
      stage === stages.RESET_PASSWORD ? EmailSchema : forgotPwdSchema,
      userData,
      { ...initialState },
    );
    if (!result.status) {
      setErrors(result.errors);
      return false;
    }
    setErrors({ ...initialState });
    return true;
  };

  return (
    <div className="LoginP_container">
      <Grid item className="Login_box" direction="column">
        <Grid item container className="Forgot_label">
          <span>Reset your password</span>
        </Grid>
        <form onChange={onChange} onSubmit={onSubmit}>
          <View className="Login_siginIn">
            {stage === stages.RESET_PASSWORD ? (
              <Grid item container>
                <TextField
                  label="Email"
                  name="username"
                  value={userData.username}
                  autoComplete={false}
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
            ) : (
              <>
                <Grid item container className="Login_pwd_container">
                  <TextField
                    label="Code *"
                    value={userData.code}
                    className="Login_input"
                    autoComplete={false}
                    type="number"
                    name="code"
                    errorMessage={errors.code}
                    hasError={errors.code !== ''}
                  />
                </Grid>
                <Grid item container className="Login_pwd_container">
                  <PasswordField
                    label="New Password"
                    value={userData.newPassword}
                    className="Login_input"
                    autoComplete={false}
                    name="newPassword"
                    errorMessage={errors.newPassword}
                    hasError={errors.newPassword !== ''}
                  />
                </Grid>
                <Grid item container className="Login_pwd_container">
                  <PasswordField
                    label="Confirm Password"
                    value={userData.confirmPassword}
                    className="Login_input"
                    autoComplete={false}
                    name="confirmPassword"
                    errorMessage={errors.confirmPassword}
                    hasError={errors.confirmPassword !== ''}
                  />
                </Grid>
              </>
            )}

            <Grid item container className="Login_messageBox">
              {errorMessage?.message !== '' && (
                <Alert
                  width={'100%'}
                  variation={
                    errorMessage.type === null ? errorMessage.type : 'error'
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
                <span>
                  {stage === stages.RESET_PASSWORD ? 'Send Code' : 'Submit'}
                </span>
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
                  if (stage === stages.RESET_PASSWORD) captchaEngine();
                  if (stage === stages.CONFIRM_PASSWORD) forgotPassword();
                }}
                className="Login_forgot_pwd"
              >
                {stage !== stages.RESET_PASSWORD
                  ? 'Resend Code'
                  : 'Back To Sign In'}
              </label>
            </Grid>
          </View>
        </form>
      </Grid>
    </div>
  );
}
