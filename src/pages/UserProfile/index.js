import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import component from './UserProfile';

const mapStateToProps = ({ user, ui, credentials, history }, props) => ({
  user,
  ui,
  credentials,
  history,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(component));
