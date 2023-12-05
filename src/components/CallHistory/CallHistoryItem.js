/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import classnames from 'classnames';
import { FormattedDate, FormattedTime } from 'react-intl';

class CallHistoryItem extends Component {
  handleClick = () => this.props.onClick(this.props.protocol);

  render() {
    const { isSelected, protocol, initial_date } = this.props;

    const anchorClasses = isSelected ? 'noclick' : 'pointer';
    const itemClasses = classnames('f6 pv3 ph2 bb b--pismo-lighter-gray', {
      'bg-white pismo-darker hover-near-white hover-bg-pismo-darker-blue':
        !isSelected,
      'bg-pismo-darker near-white': isSelected,
    });

    const dateColumnClasses = 'dib v-mid tc w-50';
    const mainColumnClasses = 'dib v-mid f7 tc tl-ns fw4 w-50 pl0 pl3-ns';

    return (
      <a className={anchorClasses} onClick={this.handleClick}>
        <li className={itemClasses}>
          <div className={dateColumnClasses}>
            <div className="b di v-mid v-base-ns db-ns">
              <FormattedDate value={initial_date} month="short" day="2-digit" />
            </div>
            <div className="di db-ns v-mid v-base-ns b normal-ns f7-ns mt2">
              <div className="di dn-ns v-mid v-base-ns">&nbsp;</div>
              <div className="di db-ns v-mid v-base-ns">
                <FormattedTime
                  hour="numeric"
                  minute="numeric"
                  value={initial_date}
                />
              </div>
            </div>
          </div>

          <div className={mainColumnClasses}>{protocol}</div>
        </li>
      </a>
    );
  }
}

export default CallHistoryItem;
