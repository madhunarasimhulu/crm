import React, { Component } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { differenceInDays, differenceInYears } from 'date-fns';
import { formatRelativeDate } from '../../../utils';

class FormattedRelativeDate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      givenDate: props.value,
      formattedRelative: '',
    };

    this.interval = null;
  }

  handleUpdateTick = () => {
    const { givenDate } = this.state;
    const formattedRelative = formatRelativeDate(givenDate);

    this.setState({
      formattedRelative,
    });
  };

  startUpdater = (msInterval) => {
    const { formattedRelative } = this.state;

    if (formattedRelative === 'now' || formattedRelative.indexOf('s') !== -1) {
      msInterval = 10000;
    }

    if (formattedRelative.indexOf('m') !== -1) {
      msInterval = 60000;
    }

    if (
      formattedRelative.indexOf('h') !== -1 ||
      formattedRelative.indexOf('d') !== -1
    ) {
      return false;
    }

    this.interval = window.setInterval(this.handleUpdateTick, msInterval);
  };

  cancelUpdater = () => {
    window.clearInterval(this.interval);
    this.interval = null;
  };

  componentDidUpdate(prevProps, prevState) {
    const { formattedRelative: previousFormatted } = prevState;
    const { givenDate, formattedRelative: currentFormatted } = this.state;

    if (!givenDate) {
      return false;
    }

    const previousType =
      previousFormatted === 'now' ? 's' : previousFormatted.replace(/\d/g, '');
    const currentType =
      currentFormatted === 'now' ? 's' : currentFormatted.replace(/\d/g, '');

    if (previousType !== currentType) {
      this.cancelUpdater();
      this.startUpdater();
    }
  }

  componentDidMount() {
    const { value: givenDate } = this.props;
    const formattedRelative = formatRelativeDate(givenDate);

    if (!givenDate) {
      return false;
    }

    this.setState({ givenDate, formattedRelative });
    this.startUpdater();
  }

  componentWillUnmount() {
    this.cancelUpdater();
  }

  render() {
    const { givenDate, formattedRelative } = this.state;
    const now = new Date();

    if (differenceInYears(now, givenDate) >= 1) {
      return (
        <FormattedDate
          value={givenDate}
          day="2-digit"
          month="short"
          year="2-digit"
        />
      );
    }

    if (differenceInDays(now, givenDate) > 29) {
      return <FormattedDate value={givenDate} day="2-digit" month="short" />;
    }

    return (
      <span>
        {formattedRelative === 'now' ? (
          <FormattedMessage id="now" />
        ) : (
          formattedRelative
        )}
      </span>
    );
  }
}

export default FormattedRelativeDate;
