import Mail_Icon from '../../assets/icons/coral/Mail_Icon.svg';
import LockIcon from '../../assets/icons/coral/lockIcon.svg';
import LoginHeader from './Aws-UI/LoginHeader';
import ForgotPwdFooter from './Aws-UI/ForgotPwdFooter';

export const formFields = {
  signIn: {
    username: {
      label: 'Email',
      placeholder: '',
      isRequired: true,
      style: {
        border: 'none',
        background: '#F2F5F7',
        borderRadius: '4px',
      },
      innerStartComponent: (
        <div style={{ padding: 8 }}>
          <img src={Mail_Icon} />
        </div>
      ),
    },
    password: {
      label: 'Password',
      placeholder: '',
      isRequired: true,
      style: {
        border: 'none',
        background: '#F2F5F7',
        borderRadius: '4px',
      },
      innerStartComponent: (
        <div style={{ padding: 8 }}>
          <img src={LockIcon} />
        </div>
      ),
    },
  },
};

export const components = {
  SignIn: { Header: LoginHeader, Footer: ForgotPwdFooter },
};
