import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import isNil from 'lodash.isnil';
import { MdArrowBack } from 'react-icons/md';
import { MdArrowForward } from 'react-icons/md';
import scrollIntoView from 'scroll-into-view';
import MonthRect from './MonthRect';
import { anyInputFocused } from '../../utils';
import {
  setSelectedMonth,
  statementsStartedScrolling,
  statementsDoneScrolling,
  resetStatements,
  toggleStatementView,
} from '../../actions';

class MonthsCarousel extends Component {
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
    const { months, selectedMonth } = this.props;
    const previousIndex = selectedMonth.index - 1;

    if (previousIndex < 0) {
      return false;
    }

    const previousMonth = months[previousIndex];

    return this.handleSelect(previousMonth.statement.id);
  };

  handleSelectCurrent = () => {
    const { months } = this.props;
    const currentMonth = months.find((m) => m.isCurrent);

    return this.handleSelect(currentMonth.statement.id);
  };

  handleSelect = (statementId) => {
    const { months, dispatch, match, history } = this.props;
    const { params } = match;
    const { customerId, accountId, statementId: statIdFromURL } = params;
    const nextSelectedMonth = months.find(
      ({ statement }) => statement.id === statementId,
    );
    const nextUrl = `/customers/${customerId}/accounts/${accountId}/statements/${
      statementId || statIdFromURL
    }`;

    dispatch(setSelectedMonth(nextSelectedMonth));
    history.replace(nextUrl);

    if (this.props.statements.currentStatement.currentView === 'totals') {
      dispatch(toggleStatementView());
    }
  };

  handleSelectNext = () => {
    const { months, selectedMonth } = this.props;
    const nextIndex = selectedMonth.index + 1;

    if (nextIndex > months.length - 1) {
      return false;
    }

    const nextMonth = months[nextIndex];
    return this.handleSelect(nextMonth.statement.id);
  };

  handleMonthsContainerElRef = (el) => {
    this.monthsContainerEl = el;
  };

  scrollSelectedMonthIntoView = () => {
    const { isScrolling } = this.props;

    if (isScrolling) {
      return false;
    }

    const { selectedMonth, dispatch } = this.props;

    if (!selectedMonth || isNil(selectedMonth) || !this.monthsContainerEl) {
      return false;
    }

    const el = this.monthsContainerEl.children[selectedMonth.index];

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
    this.scrollSelectedMonthIntoView();
  };

  componentDidUpdate(prevProps) {
    const { selectedMonth } = this.props;
    const { selectedMonth: prevSelectedMonth } = prevProps;

    if (selectedMonth.index !== prevSelectedMonth.index) {
      this.scrollSelectedMonthIntoView();
    }
  }

  componentDidMount() {
    window.setTimeout(this.scrollSelectedMonthIntoView);
    window.addEventListener('keydown', this.handlePageKeyDown);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlePageKeyDown);
    window.removeEventListener('resize', this.handleResize);
    this.props.dispatch(resetStatements());
  }

  render() {
    const { months, selectedMonth, org } = this.props;

    const outerContainerClasses = 'MonthsCarousel shadow-pismo-3';
    const outerContainerStyle = { overflowX: 'hidden', overflowY: 'hidden' };
    const containerClasses =
      'w-100 h3 h3dot5-ns nowrap bg-transparent collapse';
    const carouselContainerStyle = { overflowX: 'auto', overflowY: 'hidden' };
    const navArrowClasses = `
      dn dib-ns v-top w-5-ns h3 h3dot5-ns
      lh-3 lh-3dot5-ns tc
      bg-pismo-near-white pismo-light-silver
      ba b--pismo-lighter-gray collapse
    `;
    const currentMonthActive = months?.find((m) => m.isCurrent);
    const currentMonths = months?.filter(
      (val) =>
        new Date(val.fullDueDate) <= new Date(currentMonthActive?.fullDueDate),
    );

    return (
      <div className={outerContainerClasses} style={outerContainerStyle}>
        <div className={containerClasses}>
          <div
            className={`${navArrowClasses} ${
              selectedMonth.index <= 0 ? 'noclick' : 'pointer'
            }`}
            onClick={this.handleSelectPrevious}
            onKeyDown={this.handlePreviousArrowKeyDown}
            role="button"
            tabIndex={0}
          >
            <div>
              <MdArrowBack />
            </div>
          </div>

          <div
            className="dib v-top w-100 w-90-ns"
            style={carouselContainerStyle}
            ref={this.handleMonthsContainerElRef}
            role="tablist"
            tabIndex={0}
            onKeyDown={this.handleCarouselKeyDown}
          >
            {currentMonths.map((month) => (
              <MonthRect
                {...month}
                selectedMonth={selectedMonth}
                onSelect={this.handleSelect}
                key={month.statement.id}
                org={org}
              />
            ))}
          </div>

          <div
            className={`${navArrowClasses} ${
              selectedMonth.index >= months.length - 1 ? 'noclick' : 'pointer'
            }`}
            onClick={this.handleSelectNext}
            onKeyDown={this.handleNextArrowKeyDown}
            role="button"
            tabIndex={0}
          >
            <div>
              <MdArrowForward />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ payment, dispute, ui, statements, org }, props) => ({
  isPaymentModalOpen: payment.isOpen,
  isDisputeModalOpen: dispute.isOpen,
  ui,
  statements,
  org,
  ...props,
});

export default connect(mapStateToProps)(withRouter(MonthsCarousel));
