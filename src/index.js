import ReactDOM from 'react-dom';
import App from './App';
import { Amplify, Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import './amplify-custom.css';
import GroupRestriction from 'components/coral/GroupRestriction';
import CheckConnectivity from './components/CheckConnectivity';
//-------------Aws-Amplify-----------------
//-------------Aws-Amplify-----------------

//Lable Settings
import { I18n } from 'aws-amplify';
import { translations } from '@aws-amplify/ui-react';
import CustomAuthenticator from 'components/coral/CustomAuthenticator/CustomAuthenticator';
import TimeoutWrapper from 'Wrappers/TimeoutWrapper';
import { awsConfiguration } from 'aws-configure';
I18n.putVocabularies(translations);

I18n.putVocabulariesForLanguage('en', {
  'Sign in': 'Log in', // Button label
});
Amplify.configure(awsConfiguration[window.location.hostname]?.cognito);
Auth.configure({ storage: localStorage });

ReactDOM.render(
  <CheckConnectivity>
    <CustomAuthenticator style={{ width: '27rem' }}>
      <GroupRestriction>
        <TimeoutWrapper>
          <App />
        </TimeoutWrapper>
      </GroupRestriction>
    </CustomAuthenticator>
  </CheckConnectivity>,
  document.getElementById('root'),
);
