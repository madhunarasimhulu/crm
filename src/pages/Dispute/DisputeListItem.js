import React, { Component } from 'react';

export class DisputeListItem extends Component {
  handleClick = () => this.props.onClick(this.props.data);

  render() {
    const { children, onClick } = this.props;

    const classes = `
      ph3 ph4-ns pv3 pv3dot4-ns
      f7 f5-ns pismo-darker
      bg-white hover-bg-pismo-light-gray
      bt bb-last-child b--pismo-lighter-gray collapse
      ${onClick && typeof onClick === 'function' ? 'pointer' : ''}
    `;

    return (
      <li className={classes} onClick={this.handleClick} tabIndex={0}>
        {children}
      </li>
    );
  }
}
