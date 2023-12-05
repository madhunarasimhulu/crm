import axios from 'axios';

const jestLogin = async () => {
  const authUrl = String(process.env.REACT_APP_TEST_AUTH_URL);
  const user = {
    email: process.env.REACT_APP_TEST_EMAIL,
    password: process.env.REACT_APP_TEST_PASSWORD,
  };
  const { data } = await axios.post(authUrl, user);
  const userData = data;
  sessionStorage.setItem(
    'pismo-auth',
    Buffer.from(userData.token, 'binary').toString('base64'),
  );
  return userData;
};

export { jestLogin };
