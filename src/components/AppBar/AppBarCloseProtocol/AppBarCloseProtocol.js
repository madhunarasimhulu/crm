import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { MdClose } from 'react-icons/md';

import { FormattedMessage } from 'react-intl';
import { Hint } from '../../commons';

class AppBarCloseProtocol extends Component {
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

    return (
      <div className="dib v-mid">
        <Link
          to="/search"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <MdClose className="pa2 f3 pismo-silver pointer" />
        </Link>

        <Hint isOpen={hintIsOpen}>
          <FormattedMessage id="general.endCall" />
        </Hint>
      </div>
    );
  }
}

export default withRouter(AppBarCloseProtocol);
