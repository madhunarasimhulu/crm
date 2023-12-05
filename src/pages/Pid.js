/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MdClose } from 'react-icons/md';
import { CustomerPageWrapper, NavBar } from '../components';
import { Loader } from '../components/commons';

import showToast from '../actions/showToast';
import { submitPid } from '../actions/submitPid';
import { resetPid } from '../actions/resetPid';

const NUMBER_IDENTIFIERS = [
  'DIA_NASCIMENTO',
  'MES_NASCIMENTO',
  'ANO_NASCIMENTO',
];

const Title = styled.h1`
  font-size: 1.25rem;
  padding: 2rem 0;
  font-weight: 400;
  text-align: center;
  width: 80%;
  margin: 0 auto;
`;

const QuestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 4rem;
`;

const Question = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const QuestionTitle = styled.h2``;

const QuestionInput = styled.input`
  background-color: rgba(236, 238, 242, 0.5);
  color: #151a21;
  border: 0;
  border-bottom: 0.125rem solid #c1c7d4;
  padding: 0.75rem 0.75rem 0.7rem 0.75rem;
  transition: all 0.15s ease-in-out;
  width: 100%;
  -webkit-appearance: none;
  outline: none;

  &:active {
    background-color: #fff;
  }

  &:hover {
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
    border-bottom-color: #151a21;
    background-color: #fff;
  }
`;

const QuestionButton = styled.button`
  border: 0;
  border-bottom: 1px solid #202732;
  color: #202732;
  font-size: ${(props) => (props.small ? '0.7rem' : '1rem')};
  margin-top: 2rem;
  padding: 0 0.25rem 0.25rem;
  font-weight: 100;
  cursor: pointer;
`;

const Answers = styled.div`
  display: flex;
  flex-direction: column;
`;

const Answer = styled.div``;

const PidPage = ({
  match: {
    params: { accountId },
  },
  intl,
  history,
  dispatch,
  credentials,
  customer,
  pid: { isLoading, token, questions },
}) => {
  const [answerInput, setAnswerInput] = useState('');
  const [answers, setAnswers] = useState([]);
  const translate = useCallback((id) => intl.formatMessage({ id }), [intl]);
  const goBack = useCallback(() => history.goBack(), [history]);
  const setAnswerInputOnChange = useCallback(
    (event) => setAnswerInput(event.target.value),
    [],
  );
  const resetAnswers = useCallback(() => {
    setAnswers([]);
    setAnswerInput('');
  }, []);
  const castToNumberIdentifiers = ({ answerInput, questions, answers }) =>
    NUMBER_IDENTIFIERS.includes(questions[answers.length].identifier)
      ? parseInt(answerInput, 10)
      : answerInput;
  const saveAnswer = useCallback(() => {
    if (!answerInput) {
      return dispatch(
        showToast({
          message: translate('pid.input.empty'),
          style: 'error',
        }),
      );
    }

    setAnswers((answers) => [
      ...answers,
      {
        identifier: questions[answers.length].identifier,
        answer: castToNumberIdentifiers({ answerInput, questions, answers }),
      },
    ]);
    setAnswerInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerInput]);
  const submitAnswers = useCallback(() => {
    dispatch(
      submitPid({
        token,
        credentials,
        accountId,
        answers,
      }),
    )
      .then(() => {
        dispatch(showToast(translate('pid.submit.success')));
        window.setTimeout(history.goBack, 600);
      })
      .catch((err) => {
        if (!err || !err.response) return;
        if (
          err.response.status === 400 &&
          err.response.data.message.includes('PID expired')
        ) {
          resetAnswers();
          return dispatch(
            showToast({
              message: translate('pid.submit.expired'),
              style: 'error',
            }),
          );
        }

        dispatch(
          showToast({
            message: translate('pid.submit.error'),
            style: 'error',
          }),
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(answers)]);

  useEffect(() => () => dispatch(resetPid()), [dispatch]);

  const getQuestionTitle = ({ questions, answers }) =>
    translate(`pid.${questions[answers.length].identifier}`);

  return (
    <CustomerPageWrapper customer={customer}>
      <div className="w-100 mt3-ns">
        <div
          className="relative w-100 mw7-ns center-ns overflow-y-auto bg-white pismo-darker-blue bb b--pismo-lighter-gray"
          style={{ height: 'calc(100vh - 180px)' }}
        >
          <NavBar
            rightSlot={
              <a
                data-testid="close-button"
                onClick={goBack}
                className="pismo-darker-blue no-underline pointer"
              >
                <MdClose />
              </a>
            }
            theme="gray"
            title={<FormattedMessage id="general.pid" />}
          />
          {isLoading ? (
            <div className="pv5">
              <Loader />
            </div>
          ) : (
            <>
              <Title>
                {answers.length === questions.length
                  ? translate('pid.verifyAnswers')
                  : `${translate('pid.question')} ${answers.length + 1}/${
                      questions.length
                    }`}
              </Title>
              <QuestionsWrapper>
                {answers.length === questions.length ? (
                  <>
                    <Answers>
                      {answers.map(({ identifier, answer }) => (
                        <Answer key={identifier}>
                          <b>{translate(`pid.${identifier}`)}: </b>{' '}
                          <span>{answer}</span>
                        </Answer>
                      ))}
                    </Answers>
                    <QuestionButton
                      data-testid="question-send-button"
                      onClick={submitAnswers}
                    >
                      {translate('pid.send')}
                    </QuestionButton>
                  </>
                ) : (
                  <>
                    <Question>
                      <QuestionTitle>
                        {getQuestionTitle({ questions, answers })}
                      </QuestionTitle>
                      <QuestionInput
                        data-testid="question-input"
                        value={answerInput}
                        onChange={setAnswerInputOnChange}
                        autoFocus
                      />
                    </Question>
                    <QuestionButton
                      data-testid="question-button"
                      onClick={saveAnswer}
                    >
                      {translate('pid.continue')}
                    </QuestionButton>
                  </>
                )}
                {answers.length > 0 && (
                  <QuestionButton
                    data-testid="question-restart-button"
                    small
                    onClick={resetAnswers}
                  >
                    {translate('pid.restart')}
                  </QuestionButton>
                )}
              </QuestionsWrapper>
            </>
          )}
        </div>
      </div>
    </CustomerPageWrapper>
  );
};

const Pid = compose(
  connect(({ credentials, pid, customer }, props) => ({
    credentials,
    pid,
    customer,
    ...props,
  })),
  injectIntl,
)(PidPage);

export default Pid;
