import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactPullToRefresh from 'react-pullrefresh';

const PullToRefresh = (props) => {
  const { children, ui, settings, className, style } = props;
  const { isMobile } = ui;

  if (!isMobile) {
    return <div {...{ className, style }}>{children}</div>;
  }

  return <ReactPullToRefresh {...settings}>{children}</ReactPullToRefresh>;
};

PullToRefresh.propTypes = {
  settings: PropTypes.object,
};

PullToRefresh.defaultProps = {
  settings: {},
};

const mapStateToProps = ({ ui }, props) => ({
  ui,
  ...props,
});

export default connect(mapStateToProps)(PullToRefresh);
