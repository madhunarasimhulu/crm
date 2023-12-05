import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { MdClose } from 'react-icons/md';

import './AttendanceNotes.scss';

import { setAttendanceNote, toggleAttendanceNotes } from '../../actions';

class AttendanceNotes extends Component {
  handleKeyDown = (event) => {
    const { keyCode } = event;
    const { props } = this;
    const { attendanceNotes } = props;

    if (keyCode === 27 && attendanceNotes.isVisible) {
      this.toggleVisibility();
    }
  };

  componentDidMount() {
    const { user } = this.props;
    const { isCustomer } = user;

    if (!isCustomer) {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }

  componentWillUnmount() {
    const { user } = this.props;
    const { isCustomer } = user;

    if (!isCustomer) {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  toggleVisibility() {
    this.props.dispatch(toggleAttendanceNotes());
  }

  getProtocol() {
    if (!this.props.call) return null;
    if (!this.props.call.currentProtocol) return null;
    return this.props.call.currentProtocol;
  }

  setNoteText(evt) {
    const protocol = this.getProtocol();

    if (!protocol) return;

    const text = evt.target.value;

    this.props.dispatch(setAttendanceNote({ protocol, text }));
  }

  formatMessage(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { attendanceNotes, user } = this.props;
    const { isCustomer } = user;

    if (isCustomer) {
      return null;
    }

    const currentProtocol = this.getProtocol();
    const noteText =
      (currentProtocol &&
        attendanceNotes.notes &&
        attendanceNotes.notes[currentProtocol]) ||
      '';

    const visible = attendanceNotes.isVisible && currentProtocol;

    const classNames = [
      'AttendanceNotes',
      visible ? 'AttendanceNotes--Visible' : '',
    ].join(' ');

    return (
      <div className={classNames}>
        <div className="AttendanceNotes__Header">
          <span>{this.formatMessage('attendanceNotes.notes')}</span>
          <MdClose
            className="close-btn pointer"
            onClick={this.toggleVisibility.bind(this)}
          />
        </div>
        <div className="AttendanceNotes__Notes">
          <textarea
            tabIndex={visible ? null : -1}
            onChange={this.setNoteText.bind(this)}
            placeholder={this.formatMessage('attendanceNotes.notesPlaceholder')}
            value={noteText}
          />
        </div>
        <div className="AttendanceNotes__Footer">
          {this.formatMessage('attendanceNotes.footer')}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ call, attendanceNotes, user }, props) => ({
  call,
  attendanceNotes,
  user,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(AttendanceNotes));
