import { useAuthenticator } from '@aws-amplify/ui-react';

export default function ForgotPwdFooter() {
  const { toResetPassword } = useAuthenticator();
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 10,
        color: '#4097AA',
        fontWeight: 400,
        marginTop: -30,
        cursor: 'pointer',
      }}
      onClick={toResetPassword}
    >{`Forgot Password ?`}</div>
  );
}
