import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { isCreditProgramType } from '../../utils';

class ProfileParamsMenu extends Component {
  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const { customer, match } = this.props;
    const {
      program: { type_name: customerProgramType },
    } = customer;
    const { params } = match;
    const { customerId, accountId, subview } = params;
    const basePath = `/customers/${customerId}/accounts/${accountId}/profile`;

    const listItemClasses = 'dib v-mid ph1';
    const commonLinkClasses = 'pv2dot5 tw-px-3 no-underline br-pill f7';
    const linkClasses = `${commonLinkClasses} pismo-mid-gray`;
    const activeLinkClasses = `${commonLinkClasses} white bg-pismo-darker b`;

    return (
      <nav>
        <ul className="pv1 ph0 mh0">
          <li className={listItemClasses}>
            <Link
              to={`${basePath}/cards`}
              className={subview === 'cards' ? activeLinkClasses : linkClasses}
            >
              {this.translate('profile.menu.cards')}
            </Link>
          </li>
          <li className={listItemClasses}>
            <Link
              to={`${basePath}/info`}
              className={subview === 'info' ? activeLinkClasses : linkClasses}
            >
              {this.translate('profile.menu.data')}
            </Link>
          </li>
          {isCreditProgramType(customerProgramType) && (
            <li className={listItemClasses}>
              <Link
                to={`${basePath}/`}
                className={
                  !subview || !subview.length || subview === 'change-status'
                    ? activeLinkClasses
                    : linkClasses
                }
              >
                {this.translate('profile.menu.account')}
              </Link>
            </li>
          )}
          {customer?.entity?.is_owner === true
            ? isCreditProgramType(customerProgramType) && (
                <li className={listItemClasses}>
                  <Link
                    to={`${basePath}/spending-limits`}
                    className={
                      subview === 'spending-limits'
                        ? activeLinkClasses
                        : linkClasses
                    }
                  >
                    {this.translate('profile.menu.spendingLimits')}
                  </Link>
                </li>
              )
            : ''}
          <li className={listItemClasses}>
            <Link
              to={`${basePath}/custom-fields`}
              className={
                subview === 'custom-fields' ? activeLinkClasses : linkClasses
              }
            >
              Custom Fields
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = ({ customer, intl, ui }, props) => ({
  customer,
  intl,
  ui,
  ...props,
});

export default connect(mapStateToProps)(
  withRouter(injectIntl(ProfileParamsMenu)),
);
