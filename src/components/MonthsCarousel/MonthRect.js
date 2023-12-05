import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { parse } from 'date-fns';
import { formatDateLocale } from '../../utils';
import { FormatMoney } from '..';

class MonthRect extends Component {
  handleSelect = () => {
    const { statement, selectedMonth, onSelect } = this.props;
    const isSelected = selectedMonth.statement.id === statement.id;

    if (isSelected) {
      return false;
    }

    return onSelect(statement.id);
  };

  handleKeyDown = (event) => {
    const { keyCode } = event;

    // expecting enter key
    if (keyCode !== 13) {
      return false;
    }

    return this.handleSelect();
  };

  handleRefElement = (elem) => {
    const { selectedMonth, statement } = this.props;
    const isSelected = selectedMonth.statement.id === statement.id;

    if (!isSelected) {
      return false;
    }

    this.selectedMonthEl = elem;
  };

  render() {
    const {
      statement,
      isCurrent,
      isUpcoming,
      debits,
      current_balance,
      selectedMonth,
      org,
      intl,
      cycle_closing_date,
      cycle_opening_date,
    } = this.props;

    const isSelected = selectedMonth.statement.id === statement.id;
    const monthValue = isUpcoming ? debits : current_balance;

    const resultClosing = parse(cycle_closing_date, new Date());
    const resultOpening = parse(cycle_opening_date, new Date());

    const closingDate = formatDateLocale(resultClosing, 'DD-MMM', intl);
    const openingDate = formatDateLocale(resultOpening, 'DD-MMM', intl);

    const monthClasses = `
      relative dit v-mid h3 h3dot5-ns w3dot3-s w4-ns collapse tc animate-all
      ${
        !isCurrent && !isSelected
          ? 'bg-pismo-near-white pismo-light-silver fw4'
          : ''
      }
      ${isCurrent && isSelected ? 'bg-pismo-dark-grayish-blue white bn' : ''}
      ${
        isCurrent && !isSelected
          ? 'bg-pismo-lighter-gray pismo-darker-blue'
          : ''
      }
      ${!isCurrent && isSelected ? 'bg-pismo-dark-grayish-blue white' : ''}
      ${isCurrent || isSelected ? 'b normal-ns fw4-ns' : ''}
      ${isSelected ? 'noclick' : 'ba b--pismo-lighter-gray pointer'}
    `;

    return (
      <div
        className={monthClasses}
        onClick={this.handleSelect}
        ref={this.handleRefElement}
        onKeyDown={this.handleKeyDown}
        role="tab"
        tabIndex={0}
      >
        {isCurrent && (
          <div
            className="absolute top-0 w-100"
            style={{ fontSize: '0.6875rem', color: '#fff', top: '3px' }}
          >
            <span
              className="bg-pismo-blue br1 ttl"
              style={{ padding: '0px 4px 2px' }}
            >
              <FormattedMessage id="open" />
            </span>
          </div>
        )}

        <div className="dtc v-mid">
          <div className="f7 dn db-ns">
            <span>{org.currency}</span>{' '}
            <span>
              <FormatMoney value={monthValue} />
            </span>
          </div>

          <div className="dn-s">
            <span style={{ fontSize: '11px' }}>{`${openingDate} `}</span>

            <span style={{ fontSize: '11px' }}>
              <FormattedMessage id="to" />
            </span>

            <span style={{ fontSize: '11px' }}>{` ${closingDate}`}</span>
          </div>

          <div className="dn-ns" style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '11px' }}>{`${openingDate} `}</p>

            <p style={{ fontSize: '11px' }}>
              <FormattedMessage id="to" />
            </p>

            <p style={{ fontSize: '11px' }}>{` ${closingDate}`}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(MonthRect);
