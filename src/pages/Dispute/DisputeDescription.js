/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';

const commentInputClassnames = `
input-reset lh-copy
db w-50 pa2dot5
bb bw1
pismo-near-black bg-pismo-light-gray b--pismo-gray
hover-bg-white hover-b--pismo-near-black
hover-shadow-pismo-1
animate-all
`;

export class DisputeDescription extends Component {
  state = {
    answer: '',
  };

  handleOnChangeInput = (event) => {
    this.setState({
      answer: event.currentTarget.value,
    });
  };

  handleOnClick = () => {
    const { showToastError, saveAnswer, goToNextStep, data } = this.props;
    if (!this.state.answer)
      return showToastError('Por favor insira uma descrição');

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
        <textarea
          className={commentInputClassnames}
          style={{ resize: 'none' }}
          autoFocus
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
