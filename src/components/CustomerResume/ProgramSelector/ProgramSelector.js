import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { compose } from 'redux';
// import { Loader } from '../../commons'
import { vh100SafeCSSClass } from '../../../utils';
import {
  resetTimelineItems,
  resetPrePaidTimelineItems,
  toggleProgramSelector,
} from '../../../actions';
import './ProgramSelector.scss';

const ProgramSelector = (props) => {
  const containerClasses = 'bg-pismo-dark-blue near-white ProgramSelector';
  const vh100Safe = vh100SafeCSSClass();
  const {
    programs,
    isOpen,
    ui,
    dispatch,
    isPrepaid,
    isDebit,
    match: { params },
  } = props;

  const onClickHandler = (customer_id, account_id) => {
    dispatch(toggleProgramSelector());
    if (
      params.customerId.toString() !== customer_id.toString() &&
      params.accountId.toString() !== account_id.toString()
    ) {
      if (isPrepaid) dispatch(resetPrePaidTimelineItems());
      dispatch(resetTimelineItems());
    }
  };

  return (
    <div className={containerClasses}>
      <div
        className={`${
          isOpen ? `${vh100Safe} overflow-auto` : 'h0 overflow-hidden'
        } animate-all-slow`}
        data-testid="list-container-display"
      >
        <ul
          className={`list pa0 ma0 program-list animate-all-slow ${
            isOpen ? 'o-100' : 'o-0'
          }`}
          data-testid="list-ul-display"
        >
          {programs.map(
            ({ customer_id, account_id, program_name, isCurrent }, index) => (
              <li
                className={isCurrent ? 'active' : ''}
                key={`timelineItem_${index}`}
                role="tab"
                onClick={() => onClickHandler(customer_id, account_id)}
              >
                <Link
                  to={`/customers/${customer_id}/accounts/${account_id}${
                    isPrepaid ? '/debit' : ''
                  }${ui.isMobile ? '/summary' : ''}${isDebit ? '/debit' : ''}`}
                  className="f6 fw4"
                  role="link"
                  tabIndex={0}
                >
                  {program_name}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
};

ProgramSelector.propTypes = {
  programs: PropTypes.array,
  isOpen: PropTypes.bool,
  ui: PropTypes.object,
  isPrepaid: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ programSelector, customer, ui }, props) => ({
  programs: customer.programs,
  ...programSelector,
  ui,
  ...props,
});

export default compose(connect(mapStateToProps), withRouter)(ProgramSelector);
