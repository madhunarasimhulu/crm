/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MdKeyboardBackspace } from 'react-icons/md';
import { MdClose } from 'react-icons/md';
import {
  CustomerPageWrapper,
  NavBar,
  CustomerAvatar,
  MonthsCarousel,
  ParseMarkdown,
  FormatMoney,
} from '../../components';
import { Loader } from '../../components/commons';

import { DisputeList } from './DisputeList';
import { DisputeListItem } from './DisputeListItem';
import { DisputeOptions } from './DisputeOptions';
import { DisputeDate } from './DisputeDate';
import { DisputeDescription } from './DisputeDescription';
import { DisputeMoney } from './DisputeMoney';
import { DisputeUpload } from './DisputeUpload';
import { DisputeSuccess } from './DisputeSuccess';

import {
  setDisputeAnswer,
  submitDispute,
  resetDispute,
  showToast,
  setDisputeSubmitting,
} from '../../actions';

class DisputePage extends Component {
  getBasePath = (path = '') => {
    const {
      match: {
        params: { customerId, accountId, statementId, transactionId },
      },
    } = this.props;

    return `/customers/${customerId}/accounts/${accountId}/statements/${statementId}/transactions/${transactionId}${path}`;
  };

  getCurrentStep = () =>
    parseInt(
      (this.props.match && this.props.match.params.disputeStep) || 0,
      10,
    );

  getCurrentType = () =>
    (this.props.match && this.props.match.params.disputeType) || null;

  translate = (id) => this.props.intl.formatMessage({ id });

  goBackToTransaction = () => this.props.history.push(this.getBasePath());

  goBack = () => this.props.history.goBack();

  submit = () => {
    const {
      transaction: {
        authorization: { id: authorizationId },
      },
      match: {
        params: { disputeType },
      },
      dispatch,
      credentials,
      dispute: { answers, disagreementOptions },
    } = this.props;

    const comment = {};

    answers.forEach((itemAnswer) => {
      comment[disagreementOptions[itemAnswer.step].text.replace('*', '')] =
        itemAnswer.answer;
    });

    const data = {
      authorization_id: authorizationId,
      modality: disputeType === 'disagreements' ? '0002' : '0001',
      comment: answers
        .reverse()
        .reduce(
          (acc, { type, typeAnswer, answer }) =>
            (type && type.includes('DESCRIPTION')) ||
            (typeAnswer && typeAnswer.includes('DESCRIPTION'))
              ? answer
              : acc,
          '',
        ),
      protocol: credentials.protocol,
      disputed_amount: answers.reduce(
        (acc, { type, typeAnswer, answer }) =>
          (type && type.includes('MONEY')) ||
          (typeAnswer && typeAnswer.includes('MONEY'))
            ? answer
            : acc,
        0,
      ),
      metadata: {
        treeAnswers: { teste: true },
      },
    };

    return dispatch(submitDispute(credentials, data)).then((response) => {
      dispatch(setDisputeSubmitting(false));
      if (!response.error) {
        dispatch(showToast(this.translate('disputes.submit.success')));
      } else {
        dispatch(showToast(this.translate('disputes.submit.failure')));
      }
      window.setTimeout(this.goBackToTransaction, 3000);
    });
  };

  handleFooterClick = () => {
    const { match, dispute } = this.props;
    const {
      params: { disputeStep },
    } = match;
    const { selectedCategory } = dispute;

    const currentStep = parseInt(disputeStep, 10);
    const isFraud = selectedCategory.name === 'FRAUD';

    if (currentStep === 2 && isFraud) {
      return this.goToNextStep();
    }
  };

  redirectToTransaction = () => {
    const {
      transaction,
      dispute: { answers },
      match: {
        params: { disputeType },
      },
    } = this.props;

    if (
      transaction.authorization.is_disputed ||
      (disputeType && !answers.length)
    )
      return this.goBackToTransaction();
  };

  componentDidMount = () => {
    this.redirectToTransaction();
  };

  componentWillUnmount = () => {
    this.props.dispatch(resetDispute());
  };

  // change hard coded i18n because right now we don't have the right data
  renderTitle = (stepInfo) => (stepInfo ? stepInfo.text : 'O que aconteceu?');

  renderQuestion = ({ stepInfo, answers, stepsList }) => {
    const { history, dispatch, org } = this.props;
    const getStartFlowTo = (path) => () => history.push(this.getBasePath(path));
    const goToNextStep = (step) =>
      history.push(
        this.getBasePath(`/dispute/${this.getCurrentType()}/${step}`),
      );
    const saveAnswer = ({ typeAnswer, answer }) =>
      dispatch(
        setDisputeAnswer({
          typeDispute: this.getCurrentType(),
          step: this.getCurrentStep(),
          typeAnswer,
          answer,
        }),
      );
    const showToastError = (message) =>
      dispatch(
        showToast({
          message,
          style: 'error',
        }),
      );

    const initialComponent = (
      <DisputeList>
        <DisputeListItem onClick={getStartFlowTo('/dispute/disagreement/0')}>
          Contestar cobrança
        </DisputeListItem>
        <DisputeListItem
          onClick={getStartFlowTo('/dispute/service-problems/0')}
        >
          Problemas com o serviço
        </DisputeListItem>
      </DisputeList>
    );

    const componentTypes = {
      OPTION: ({ data, currentAnswers }) => (
        <DisputeOptions
          data={data}
          currentAnswers={currentAnswers}
          saveAnswer={saveAnswer}
          goToNextStep={goToNextStep}
        />
      ),
      DATE: ({ data, currentAnswers }) => (
        <DisputeDate
          data={data}
          currentAnswers={currentAnswers}
          saveAnswer={saveAnswer}
          goToNextStep={goToNextStep}
          showToastError={showToastError}
        />
      ),
      DESCRIPTION: ({ data, currentAnswers }) => (
        <DisputeDescription
          data={data}
          currentAnswers={currentAnswers}
          saveAnswer={saveAnswer}
          goToNextStep={goToNextStep}
          showToastError={showToastError}
        />
      ),
      MONEY: ({ data, currentAnswers }) => (
        <DisputeMoney
          data={data}
          currentAnswers={currentAnswers}
          saveAnswer={saveAnswer}
          goToNextStep={goToNextStep}
          showToastError={showToastError}
          currency={org.currency}
        />
      ),
      CAMERA: ({ data, currentAnswers }) => (
        <DisputeUpload
          data={data}
          currentAnswers={currentAnswers}
          saveAnswer={saveAnswer}
          goToNextStep={goToNextStep}
          showToastError={showToastError}
        />
      ),
      SUCCESS: ({ data, currentAnswers, stepsList }) => (
        <DisputeSuccess
          data={data}
          currentAnswers={currentAnswers}
          stepsList={stepsList}
          submit={this.submit}
        />
      ),
    };

    return stepInfo
      ? componentTypes[stepInfo.type]({
          data: stepInfo,
          currentAnswers: answers,
          stepsList,
        })
      : initialComponent;
  };

  renderRightSlotMenu = (stepInfo) => {
    if (stepInfo && stepInfo.type.includes('SUCCESS')) return null;

    return this.getCurrentStep() ? (
      <a
        onClick={this.goBack}
        className="pismo-darker-blue no-underline pointer"
      >
        <MdKeyboardBackspace />
      </a>
    ) : (
      <a
        onClick={this.goBackToTransaction}
        className="pismo-darker-blue no-underline pointer"
      >
        <MdClose />
      </a>
    );
  };

  render = () => {
    const {
      customer: { entity: { name: customerName = '' } = {} } = {},
      statements: {
        months,
        isLoading: isLoadingStatements,
        isScrolling,
        selectedMonth,
      } = {},
      transaction: { authorization, merchant, transaction } = {},
      dispute: {
        isLoadingDisputeTree,
        disagreementOptions,
        serviceProblemsOptions,
        answers,
      } = {},
    } = this.props;

    const disputeData = {
      disagreement: disagreementOptions.map((option, index) => ({
        ...option,
        step: index,
      })),
      'service-problems': serviceProblemsOptions.map((option, index) => ({
        ...option,
        step: index,
      })),
    };
    const currentType = this.getCurrentType();
    const currentStep = this.getCurrentStep();
    const stepsList = currentType && disputeData[currentType];
    const stepInfo = stepsList && stepsList[currentStep];

    const containerClasses = `
      relative w-100 mw7-ns center-ns overflow-y-auto
      bg-white pismo-darker-blue
      bb b--pismo-lighter-gray
    `;

    return (
      <CustomerPageWrapper customer={this.props.customer}>
        <MonthsCarousel
          months={months}
          isScrolling={isScrolling}
          isLoading={isLoadingStatements}
          selectedMonth={selectedMonth}
        />

        <div className="w-100 mt3-ns">
          <div
            className={containerClasses}
            style={{ height: 'calc(100vh - 180px)' }}
          >
            <NavBar
              leftSlot={<CustomerAvatar name={customerName} size="34" />}
              rightSlot={this.renderRightSlotMenu(stepInfo)}
              theme="gray"
              title={
                <span>
                  {transaction.id ? (
                    <div>
                      <div className="f6 f5-ns mb1">
                        <FormatMoney value={authorization.amount} showSymbol />
                      </div>
                      <div className="fw4 f7">
                        {authorization.softDescriptor || merchant.name}
                      </div>
                    </div>
                  ) : (
                    <FormattedMessage id="general.dispute" />
                  )}
                </span>
              }
            />
            {isLoadingDisputeTree ? (
              <div className="pv5">
                <Loader />
              </div>
            ) : (
              <div>
                {stepInfo && stepInfo.type !== 'SUCCESS' && (
                  <div className="f4-ns tc pv3 pv4-ns b fw4-ns w-80 center">
                    <ParseMarkdown>{this.renderTitle(stepInfo)}</ParseMarkdown>
                  </div>
                )}
                <div>
                  {this.renderQuestion({ stepInfo, answers, stepsList })}
                </div>
              </div>
            )}
          </div>
        </div>
      </CustomerPageWrapper>
    );
  };
}

const mapStateToProps = (
  { customer, statements, transaction, dispute, credentials, org },
  props,
) => ({
  credentials,
  customer,
  statements,
  transaction,
  dispute,
  org,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(DisputePage));
