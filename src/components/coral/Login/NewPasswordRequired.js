import { View, Alert, Button, PasswordField } from '@aws-amplify/ui-react';
import { CircularProgress, Grid } from '@material-ui/core';
import * as yup from 'yup';
import { genErrors } from 'utils/coral/Validations';
import { useState } from 'react';
import { Auth } from 'aws-amplify';

const changePasswordSchema = yup.object().shape({
  newPwd: yup
    .string()
    .required('Password is required')
    .min(8, 'Password should be atleast 8 characters')
    .max(40, 'Password should be atmost 40 characters'),
  confirmPassword: yup.string().required('Confirm Password is required'),
});

const initialState = {
  newPwd: '',
  confirmPassword: '',
};

export default function NewPasswordRequired({
  onSetErrorMessage,
  userDataProp,
  setCogntioUser,
  captchaEngine,
}) {
  const [userData, setUserdata] = useState({
    ...initialState,
  });
  const [errors, setErrors] = useState({
    ...initialState,
  });
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
    if (userData.confirmPassword !== userData.newPwd) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Password Should Match',
      }));
      return;
    }
    // Captcha check
    changePasswordSubmit();
  };

  const changePasswordSubmit = async () => {
    setLoading(true);

    let user = await Auth.signIn(
      userDataProp.username,
      userDataProp.password,
    ).catch((e) => {
      setErrorMessage((prev) => ({ ...prev, message: e?.message }));
      return null;
    });

    setCogntioUser(user);

    if (user?.challengeName === 'NEW_PASSWORD_REQUIRED') {
      let changePwdResp = await Auth.completeNewPassword(
        user, // the Cognito User Object
        userData.newPwd, // the new password
      ).catch((e) => {
        setErrorMessage((prev) => ({ ...prev, message: e?.message }));
      });
      if (changePwdResp?.challengeName) {
        onSetErrorMessage({ code: changePwdResp?.challengeName, message: '' });
      }
    }
    setLoading(false);
  };

  const validate = async () => {
    let result = await genErrors(changePasswordSchema, userData, {
      ...initialState,
    });
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
          <span>Change Password</span>
        </Grid>
        <form onChange={onChange} onSubmit={onSubmit}>
          <View className="Login_siginIn">
            <>
              <Grid item container className="Login_pwd_container">
                <PasswordField
                  label="New Password"
                  value={userData.newPwd}
                  className="Login_input"
                  autoComplete={false}
                  name="newPwd"
                  errorMessage={errors.newPwd}
                  hasError={errors.newPwd !== ''}
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
                <span>Change Password</span>
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
