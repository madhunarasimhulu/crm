/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from 'components/commons';

class AccountParamsBox extends Component {
  render() {
    const {
      title,
      value,
      subtitle,
      classType,
      action,
      onClick,
      ui,
      org,
      paramsLoading,
    } = this.props;
    const { isMobile } = ui;

    if (!action) {
      return (
        <div
          className={`tc w-100 pv4 profile-params-details-item relative db ${classType}`}
        >
          <div className="animate-all">
            <h4 className="mv0 f5 fw4 white">{title}</h4>
            <h3 className="mv2 f3 f2-ns white">
              <span className="fw4">{org.currency} </span>
              {value}
            </h3>
            <span className="mv0 fw4 white">{subtitle}</span>
          </div>
        </div>
      );
    }

    if (isMobile) {
      return (
        <a
          className={`tc pointer w-100 pv4 profile-params-details-item relative db ${classType}`}
          onClick={onClick}
        >
          {paramsLoading ? (
            <Loader size="medium" />
          ) : (
            <>
              <div className="o-100 ph1 details-info animate-all">
                <h4 className="mv0 f5 fw4 white">{title}</h4>
                <h3 className="mv2 f3 f2-ns white">
                  <span className="fw4">{org.currency} </span>
                  {value}
                </h3>
                <span className="mv0 fw4 white">{subtitle}</span>
                <div className="action-btn action-btn-bottom white">
                  <span>{action}</span>
                </div>
              </div>
              <div className="o-0 dn action-btn db animate-all white w-100 absolute top-0 bottom-0">
                <span>{action}</span>
              </div>
            </>
          )}
        </a>
      );
    }
    return (
      <a
        className={`tc pointer w-100 pv4 profile-params-details-item relative db ${classType}`}
        onClick={onClick}
      >
        {paramsLoading ? (
          <Loader size="medium" />
        ) : (
          <>
            <div className="o-100 details-info animate-all">
              <h4 className="mv0 f5 fw4 white">{title}</h4>
              <h3 className="mv2 f3 f2-ns white">
                <span className="fw4">{org.currency} </span>
                {value}
              </h3>
              <span className="mv0 fw4 white">{subtitle}</span>
            </div>
            <div className="o-0 dn action-btn db animate-all white w-100 absolute top-0 bottom-0">
              <span>{action}</span>
            </div>
          </>
        )}
      </a>
    );
  }
}

AccountParamsBox.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  classType: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const mapStateToProps = ({ ui, org }, props) => ({
  ui,
  org,
  ...props,
});

export default connect(mapStateToProps)(AccountParamsBox);
