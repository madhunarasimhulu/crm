import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Hint } from '../../../commons';
import { FormatMoney } from '../../..';

class ProgressBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hintIsOpen: false,
    };
  }

  handleMouseEnter = () => {
    this.setState({
      hintIsOpen: true,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      hintIsOpen: false,
    });
  };

  render() {
    const { hintIsOpen } = this.state;
    const { isDue, isOpen, isUpcoming, payed, total, currency } = this.props;
    const percentual = Math.floor((payed / total) * 100);

    const classes = `w-100 ${
      isDue
        ? 'bg-pismo-pink'
        : isOpen && isUpcoming
        ? 'bg-pismo-mid-gray'
        : 'bg-pismo-blue'
    }`;

    const outerClasses = 'w-100';
    const innerClasses = `h1 ${
      isDue
        ? 'bg-pismo-dark-pink'
        : isOpen && isUpcoming
        ? 'bg-pismo-gray'
        : 'bg-pismo-brighter-blue'
    }`;

    const innerStyle = {
      width: `${percentual}%`,
    };
    const outerStyle = {
      backgroundColor: `${
        isDue ? '#d04856' : isOpen && isUpcoming ? '#949494' : '#2396c3'
      }`,
    };

    return (
      <div
        className={classes}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className={outerClasses} style={outerStyle}>
          <div className={innerClasses} style={innerStyle} />
        </div>
        <Hint isOpen={hintIsOpen}>
          <FormattedMessage
            id="totals.amountPaid"
            values={{
              value: (
                <b>
                  {currency}
                  <FormatMoney value={payed} />
                </b>
              ),
            }}
          />
        </Hint>
      </div>
    );
  }
}

export default injectIntl(ProgressBar);
