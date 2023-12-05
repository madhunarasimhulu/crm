import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PageWrapper, MenuVertical, CustomerResume } from '..';
import { vh100SafeCSSClass } from '../../utils';
import { toggleAttendanceNotes } from '../../actions';
import './CustomerPageWrapper.scss';

class CustomerPageWrapper extends Component {
  handleMainContentClick = () => {
    const { attendanceNotes, dispatch } = this.props;
    const { isVisible: areNotesVisible } = attendanceNotes;

    if (areNotesVisible) {
      dispatch(toggleAttendanceNotes());
    }
  };

  render() {
    const { customer, children, overflowWrapper } = this.props;
    const overflow = overflowWrapper
      ? 'overflow-hidden'
      : 'overflow-y-auto overflow-x-hidden';
    const vh100Safe = vh100SafeCSSClass();

    return (
      <PageWrapper>
        <div className="main-container">
          <MenuVertical />

          <div
            className="dib-ns v-mid w-70"
            style={{ flexGrow: 1 }}
            onClick={this.handleMainContentClick}
          >
            <div
              className={`relative v-mid dib-l fr-l w-100 w-75-l ${vh100Safe} ${overflow} bg-pismo-near-white`}
            >
              {children}
            </div>

            <div className="v-mid dn dib-l fl-l w-25">
              <CustomerResume customer={customer} />
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }
}

CustomerPageWrapper.propTypes = {
  customer: PropTypes.object,
  overflowWrapper: PropTypes.bool,
};

CustomerPageWrapper.defaultProps = {
  overflowWrapper: true,
};

const mapStateToProps = ({ customer, attendanceNotes }, props) => ({
  customer,
  attendanceNotes,
  ...props,
});

export default connect(mapStateToProps)(CustomerPageWrapper);
