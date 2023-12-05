import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

class PeriodRect extends Component {
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
    const { period, selectedPeriod } = this.props;

    const isSelected = selectedPeriod.value === period;

    const periodClasses = `
      relative dit v-mid h3 h3dot5-ns w3dot3-s w4-ns collapse tc animate-all
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
            <div className="ttc">
              <FormattedMessage id={period} />
            </div>
            {/* <span className="ttc">
                <FormattedMessage id={`days`} />
              </span> */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ui }) => ({
  ui,
});

export default connect(mapStateToProps)(injectIntl(PeriodRect));
