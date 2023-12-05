/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Loader } from '../../components/commons';
import { ParseMarkdown } from '../../components';

export class DisputeSuccess extends Component {
  state = {
    success: false,
    error: null,
    loading: false,
  };

  handleOnClick = () => {
    this.setState({ loading: true });

    this.props
      .submit()
      .then(() => this.setState({ loading: false, success: true }))
      .catch(() =>
        this.setState({
          loading: false,
          error:
            'Ocorreu um erro ao solicitar contestação, por favor tente novamente mais tarde.',
        }),
      );
  };

  getQuestionFromOptions = ({ step }) =>
    this.props.stepsList && this.props.stepsList[step].text;

  render() {
    const { success, error, loading } = this.state;
    const { data, currentAnswers } = this.props;

    return loading ? (
      <div className="pv5">
        <Loader />
      </div>
    ) : (
      <div className="flex flex-column items-center">
        <div className="f4-ns tc pv3 pv4-ns b fw4-ns w-80 center">
          {success ? (
            <ParseMarkdown>{data.text}</ParseMarkdown>
          ) : (
            'Por favor verifique as informações abaixo e confime o envio'
          )}
        </div>
        {success ? (
          <p>Sucesso!</p>
        ) : (
          <div className="w-80">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
              {currentAnswers.map(({ answer, step }, index) => (
                <div key={index}>
                  <b>
                    <ParseMarkdown>
                      {this.getQuestionFromOptions({ step })}
                    </ParseMarkdown>
                  </b>
                  <p>{answer}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <a
                className="pismo-darker bb b--pismo-darker pb1 ph1 fw4 f6 f5-ns hover-b pointer mt4"
                onClick={this.handleOnClick}
              >
                Confirmar
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}
