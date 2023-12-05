/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { TextDateInput } from '../../components/commons';

export class DisputeDate extends Component {
  state = {
    answer: '',
  };

  handleOnChangeInput = (answer) => this.setState({ answer });

  handleOnClick = () => {
    const { showToastError, saveAnswer, goToNextStep, data } = this.props;
    if (!this.state.answer || this.state.answer.length < 10)
      return showToastError('Por favor insira uma data');

    saveAnswer({ answer: this.state.answer, typeAnswer: data.type });
    goToNextStep(data.next);
  };

  componentDidMount() {
    const { data, currentAnswers } = this.props;
    const currentAnswerData = currentAnswers.find(
      ({ step }) => step === data.step,
    );

    if (currentAnswerData) this.setState({ answer: currentAnswerData.answer });
  }

  render() {
    return (
      <div className="flex flex-column items-center">
        <TextDateInput
          className="w-50"
          name="date"
          type="text"
          placeholder="12/12/2018"
          autoFocus
          maxLength="10"
          value={this.state.answer}
          onChange={this.handleOnChangeInput}
        />
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
