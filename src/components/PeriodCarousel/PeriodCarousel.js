import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import isNil from 'lodash.isnil';
import scrollIntoView from 'scroll-into-view';
import RangePeriodRect from './RangePeriodRect';
import PeriodRect from './PeriodRect';
import { anyInputFocused } from '../../utils';
import {
  setSelectedPeriod,
  statementsStartedScrolling,
  statementsDoneScrolling,
  resetStatements,
  setModalCalendar,
  setSelectedPeriodTimelineToPrePaid,
} from '../../actions';

class PeriodCarousel extends Component {
  handlePreviousArrowKeyDown = (event) => {
    const { isPaymentModalOpen, isDisputeModalOpen } = this.props;

    if (isPaymentModalOpen || isDisputeModalOpen) {
      return false;
    }

    const expectedCodes = [37, 13]; // left arrow, enter
    const { keyCode } = event;

    if (!expectedCodes.includes(keyCode)) {
      return false;
    }

    return this.handleSelectPrevious();
  };

  handlePageKeyDown = (event) => {
    const { isPaymentModalOpen, isDisputeModalOpen } = this.props;

    if (isPaymentModalOpen || isDisputeModalOpen || anyInputFocused()) {
      return false;
    }

    const callbackMap = {
      37: this.handleSelectPrevious, // left
      39: this.handleSelectNext, // right
      72: this.handleSelectCurrent, // 'H'
    };

    const { keyCode } = event;
    const callback = callbackMap[keyCode];

    if (!callback || typeof callback !== 'function') {
      return false;
    }

    return callback();
  };

  handleNextArrowKeyDown = (event) => {
    const { isPaymentModalOpen, isDisputeModalOpen } = this.props;

    if (isPaymentModalOpen || isDisputeModalOpen) {
      return false;
    }

    const expectedCodes = [39, 13]; // right arrow, enter
    const { keyCode } = event;

    if (!expectedCodes.includes(keyCode)) {
      return false;
    }

    return this.handleSelectNext();
  };

  handleSelectPrevious = () => {
    const { periods, selectedPeriod } = this.props;
    const previousIndex = selectedPeriod.index - 1;

    if (previousIndex < 0) {
      return false;
    }

    const previousPeriod = periods[previousIndex];
    return this.handleSelect(previousPeriod);
  };

  handleSelectCurrent = () => {
    const { periods } = this.props;
    const currentPeriod = periods.find((p) => p.isCurrent);

    return this.handleSelect(currentPeriod);
  };

  handleSelect = (period) => {
    const { dispatch, customer, history } = this.props;
    const { customerId, accountId } = customer;

    const nextUrl = `/customers/${customerId}/accounts/${accountId}/debit`;
    history.replace(nextUrl);

    if (period === 'custom') dispatch(setModalCalendar(true));
    else
      dispatch(
        setSelectedPeriodTimelineToPrePaid({ startDate: null, endDate: null }),
      );
    dispatch(setSelectedPeriod(period));
  };

  handleSelectNext = () => {
    const { periods, selectedPeriod } = this.props;
    const nextIndex = selectedPeriod.index + 1;

    if (nextIndex > periods.length - 1) {
      return false;
    }

    const nextPeriod = periods[nextIndex];
    return this.handleSelect(nextPeriod);
  };

  handlePeriodsContainerElRef = (el) => {
    this.periodsContainerEl = el;
  };

  scrollSelectedPeriodIntoView = () => {
    const { isScrolling } = this.props;

    if (isScrolling) {
      return false;
    }

    const { selectedMonth, dispatch } = this.props;

    if (!selectedMonth || isNil(selectedMonth) || !this.periodsContainerEl) {
      return false;
    }

    const el = this.periodsContainerEl.children[selectedMonth.index];

    if (!el) {
      return false;
    }

    dispatch(statementsStartedScrolling());

    scrollIntoView(
      el,
      {
        time: 200,
        ease: (t) =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, // easeInOutCubic
      },
      () => dispatch(statementsDoneScrolling()),
    );
  };

  handleResize = () => {
    this.scrollSelectedPeriodIntoView();
  };

  componentDidUpdate(prevProps) {
    const { selectedPeriod } = this.props;
    const { selectedPeriod: prevSelectedPeriod } = prevProps;

    if (selectedPeriod.index !== prevSelectedPeriod.index) {
      this.scrollSelectedPeriodIntoView();
    }
  }

  componentDidMount() {
    window.setTimeout(this.scrollSelectedPeriodIntoView);
    window.addEventListener('keydown', this.handlePageKeyDown);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlePageKeyDown);
    window.removeEventListener('resize', this.handleResize);
    this.props.dispatch(resetStatements());
  }

  render() {
    const { periods, selectedPeriod } = this.props;
    const indexCustomPeriod = periods.indexOf('custom');
    let carouselPeriods = periods;

    // remove the "custom" period
    if (indexCustomPeriod > -1) {
      carouselPeriods = periods.splice(indexCustomPeriod, 1);
    }

    const outerContainerClasses = 'MonthsCarousel shadow-pismo-3';
    const outerContainerStyle = { overflowX: 'hidden', overflowY: 'hidden' };
    const containerClasses =
      'w-100 h3 h3dot5-ns nowrap bg-transparent collapse';
    const carouselContainerStyle = { overflowX: 'auto', overflowY: 'hidden' };

    return (
      <div className={outerContainerClasses} style={outerContainerStyle}>
        <div className={containerClasses}>
          <div
            className="dib v-top w-100 w-90-ns"
            style={carouselContainerStyle}
            ref={this.handlePeriodsContainerElRef}
            role="tablist"
            tabIndex={0}
            onKeyDown={this.handleCarouselKeyDown}
          >
            {carouselPeriods.map((period) => (
              <PeriodRect
                period={period}
                selectedPeriod={selectedPeriod}
                onSelect={this.handleSelect}
                key={period}
              />
            ))}

            <RangePeriodRect
              period="custom"
              selectedPeriod={selectedPeriod}
              onSelect={this.handleSelect}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  { payment, dispute, ui, customer, credentials, prePaid },
  props,
) => ({
  isPaymentModalOpen: payment.isOpen,
  isDisputeModalOpen: dispute.isOpen,
  ui,
  customer,
  credentials,
  prePaid,
  ...props,
});

export default connect(mapStateToProps)(withRouter(PeriodCarousel));
