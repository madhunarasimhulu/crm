/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';

export class DisputeUpload extends Component {
  state = {
    answer: null,
  };

  handleOnChangeInput = (event) => {
    this.setState({
      answer: event.currentTarget.value,
    });
  };

  handleOnClick = () => {
    const { saveAnswer, goToNextStep, data } = this.props;

    saveAnswer({ answer: this.state.answer, typeAnswer: data.type });
    goToNextStep(data.next);
  };

  render() {
    return (
      <div className="flex flex-column items-center">
        <a
          className="pismo-darker bb b--pismo-darker pb1 ph1 fw4 f6 f5-ns hover-b pointer mt4"
          onClick={this.handleOnClick}
        >
          Continuar
        </a>
      </div>
    );
  }
}
