import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

class RangePeriodRect extends Component {
  handleSelect = () => {
    const { period, selectedPeriod, onSelect } = this.props;
    const isSelected = selectedPeriod.value === period;

    if (isSelected) {
      return false;
    }

    return onSelect(period);
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
    const { selectedPeriod, period } = this.props;
    const isSelected = selectedPeriod.value === period;

    if (!isSelected) {
      return false;
    }

    this.selectedMonthEl = elem;
  };

  render() {
    const { period, selectedPeriod, intl } = this.props;

    const isSelected = selectedPeriod.value === period;

    const _fm = (id) => intl.formatMessage({ id });

    const periodClasses = `
      absolute dit v-mid h3 h3dot5-ns w3dot3-s w4-ns collapse tc animate-all right-0
      ${!isSelected ? 'bg-pismo-near-white pismo-light-silver fw4' : ''}
      ${
        isSelected
          ? 'bg-pismo-dark-grayish-blue white b normal-ns fw4-ns noclick'
          : 'ba b--pismo-lighter-gray pointer'
      }
    `;

    return (
      <div
        className={periodClasses}
        onClick={this.handleSelect}
        ref={this.handleRefElement}
        onKeyDown={this.handleKeyDown}
        role="tab"
        tabIndex={0}
      >
        <div className="dtc v-mid">
          <div
            className="f7 f5-ns"
            style={{ marginTop: '1px', marginBottom: '4px' }}
          >
            <div className="ttc">{_fm('date')}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ui }) => ({
  ui,
});

export default connect(mapStateToProps)(injectIntl(RangePeriodRect));
