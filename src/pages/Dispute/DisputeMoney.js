/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { TextInput } from '../../components/commons';
import { getCurrencyConfig } from '../../utils';

export class DisputeMoney extends Component {
  state = {
    answer: '',
  };

  handleOnChangeInput = (event, answer) => {
    this.setState({
      answer,
    });
  };

  handleOnClick = () => {
    const { showToastError, saveAnswer, goToNextStep, data } = this.props;
    if (!this.state.answer) return showToastError('Por favor insira um valor');

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
    const currencyConfig = getCurrencyConfig(this.props.currency || 'BRL');
    return (
      <div className="flex flex-column items-center">
        <TextInput
          name="amount"
          className="w-50"
          type="currency"
          currency={this.props.currency || 'BRL'}
          config={currencyConfig}
          value={this.state.answer}
          autoFocus
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
