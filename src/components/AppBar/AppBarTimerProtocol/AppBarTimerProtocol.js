import React, { Component } from 'react';
import { connect } from 'react-redux';
import format from 'date-fns/format';

const hour = 60 * 60 * 1000;

class AppBarTimerProtocol extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      timerCount: null,
    };
  }

  tick = () => {
    const { timerCount } = this.state;
    this.setState({ timerCount: timerCount + 1000 });
  };

  componentDidMount() {
    const {
      call: { timerCount },
    } = this.props;
    this.setState({ timerCount });
    this.timer = window.setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  render() {
    const { timerCount } = this.state;
    const timerClasses = 'pr3 dn dib-ns';
    const timeFormat = timerCount > hour ? 'HH:mm:ss' : 'mm:ss';
    const timeFormatted = format(
      new Date(0, 0, 0, 0, 0, 0, timerCount),
      timeFormat,
    );
    return <span className={timerClasses}>{timeFormatted}</span>;
  }
}

const mapStateToProps = ({ call }) => ({
  call,
});

export default connect(mapStateToProps)(AppBarTimerProtocol);
