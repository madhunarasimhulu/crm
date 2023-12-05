import React, { Fragment } from 'react';
import './AppBarProtocol.scss';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

const AppBarProtocol = ({ protocol }) => (
  <>
    <p className="app-bar-protocol">
      <span className="dn dib-ns">
        <FormattedMessage id="protocol" />: &nbsp;
      </span>
      <span className="f6 f5-ns">{protocol}</span>
    </p>
  </>
);

const mapStateToProps = ({ intl }, props) => ({
  intl,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(AppBarProtocol));
