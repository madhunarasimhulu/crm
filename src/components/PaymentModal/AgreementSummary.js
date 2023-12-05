/* eslint-disable react/style-prop-object */
import React, { Fragment, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  FormattedMessage,
  injectIntl,
  FormattedDate,
  FormattedNumber,
} from 'react-intl';
import { MdKeyboardBackspace } from 'react-icons/md';
import { MdClose } from 'react-icons/md';
import { MdCheckCircle } from 'react-icons/md';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import select from 'select';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Loader, TextInput } from '../commons';
import { compensateDate, unselect } from '../../utils';
import {
  resetAgreementSummary,
  getAgreementConditions,
  generateSplitInvoice,
  setAgreementSendingSmsOrEmail,
  showToast,
} from '../../actions';
import 'react-perfect-scrollbar/dist/css/styles.css';

const ScrollContainer = styled.div`
  height: 220px;
`;

const AgreementSummary = (props) => {
  const GeneralContainer = styled.div`
    text-align: center;
    padding: 1rem;
    font-weight: 400;
    min-width: 320px;
    min-height: 280px;
  `;
  const TextTitle = styled.span`
    font-weight: bold;
    text-align: center;
    line-height: 1.5;
  `;

  const TextContainer = styled.div`
    text-align: ${(props) => (props.left ? 'left' : 'center')};
    font-weight: 400;
  `;

  const ButtonBack = styled.div`
    position: absolute;
    margin-top: 0.75rem;
    left: 1rem;
    top: 0;
  `;

  const ButtonClose = styled.div`
    position: absolute;
    margin-top: 0.75rem;
    right: 1rem;
    top: 0;
  `;

  const ButtonAdvance = styled.button`
    width: ${(props) => (props.w90 ? '94' : '80')}%;
    margin-right: auto;
    margin-left: auto;
    padding: 0.8rem 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
    background-color: #e1e5ed;
    font-weight: 400;
    /* disabled: ${(props) => props.disabled}; */
    border: none;
  `;

  const ButtonDate = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    text-align: center;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  `;
  const ButtonAction = styled.button`
    width: 45%;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    padding: 0.8rem 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    background-color: ${(props) => (props.pressed ? '#2c3644' : '#ffffff')};
    color: ${(props) => (props.pressed ? '#ffffff' : '#2c3644')};
    border: 1px solid #e1e5ed;
    font-weight: 700;
  `;

  const Button = styled.button`
    font-size: 1.25rem;
    background-color: transparent;
    border-style: none;
    border-width: 0;
    cursor: pointer;
  `;

  const Spacer = styled.div`
    margin-top: 1rem;
  `;

  const InvoiceUl = styled.ul`
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
  `;

  const InvoiceLi = styled.li`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.85rem;
  `;

  const InvoiceDesc = styled.span`
    text-transform: capitalize;
  `;

  const InvoiceValue = styled.span`
    font-weight: 700;
  `;

  const InvoiceTotal = styled.li`
    display: flex;
    justify-content: space-between;
    border-top: 1px solid black;
    padding-top: 0.85rem;
    font-weight: 700;
  `;

  const TextMinimum = styled.div`
    font-size: 0.875rem;
    color: ${(props) => (props.inputValueError ? 'red' : '#c1c7d4')};
    margin-top: 0.25rem;
  `;

  const IconContainer = styled.div`
    margin-bottom: 0.2rem;
  `;
  const LegalContainer = styled.div`
    border: 1px solid #e1e5ed;
    background-color: #e1e5ed;
    border-radius: 5px;
    padding: 1rem;
  `;

  const { agreement, currency } = props;
  const {
    isLoading,
    isSendingSmsOrEmail,
    summary,
    dueDates,
    conditions,
    conclusion,
  } = agreement;
  const { dates } = dueDates;

  const [inputValue, setInputValue] = useState('');
  const [inputValueError, setInputValueError] = useState(false);
  const [selectionsDateIndex, setSelectionDateIndex] = useState([]);
  const [selectionInstallmentsIndex, setSelectionInstallmentsIndex] = useState(
    [],
  );
  const [step, setStep] = useState(0);
  const [submitDataObj, setSubmitDataObj] = useState({});
  const [hasSentSMS, setHasSentSMS] = useState(false);
  const [hasSentEmail, setHasSentEmail] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const bankslipEl = useRef(null);

  const translate = (id) => props.intl.formatMessage({ id });

  useEffect(() => {
    const setLocalData = () => {
      const populated = dates.reduce((acc) => {
        acc.push(false);
        return acc;
      }, []);
      setSelectionDate(populated);
    };
    // eslint-disable-next-line no-unused-vars
    const checkForDates = () => {
      // eslint-disable-next-line no-unused-vars
      if (!dates) setTimeout(() => checkForDates(), 500);
      else setLocalData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = (isClose) => {
    const { dispatch, handleClose } = props;
    setHasCopied(false);
    setHasSentSMS(false);
    setHasSentEmail(false);
    if (step === 0) dispatch(resetAgreementSummary());
    else setStep(step - 1);
    if (isClose) handleClose();
  };

  const handleChange = (event, value) => {
    setInputValue(value);
    if (value < Number(summary.min_upfront_amount)) setInputValueError(true);
    else setInputValueError(false);
  };

  const setSelectionDate = (index) => {
    const nData = dates.reduce((acc, item, accIndex) => {
      accIndex === index ? acc.push(true) : acc.push(false);
      return acc;
    }, []);
    setSelectionDateIndex(nData);
  };

  const setSelectionInstallments = (index) => {
    const nIntallments = conditions.installment_options.reduce(
      (acc, item, accIndex) => {
        accIndex === index ? acc.push(true) : acc.push(false);
        return acc;
      },
      [],
    );
    setSelectionInstallmentsIndex(nIntallments);
  };

  const handleGetAgreementConditions = async (
    minUpfront,
    dates,
    selectionsDateIndex,
  ) => {
    const { dispatch, credentials, customer } = props;
    const { accountId } = customer;
    const upfront = Number(inputValue);
    const fistPayment = dates[selectionsDateIndex.findIndex((val) => val)];
    if (upfront >= minUpfront) {
      setSubmitDataObj({
        first_payment_amount: upfront,
        first_payment_date: fistPayment,
      });
      try {
        await dispatch(
          getAgreementConditions(accountId, credentials, upfront, fistPayment),
        );
        setStep(1);
        return;
      } catch (err) {
        dispatch(
          showToast({
            message: translate('paymentModal.payment.installments.error'),
            style: 'error',
          }),
        );
      }
    }
  };

  const handleSetupSubmit = (installments) => {
    setSubmitDataObj({
      ...submitDataObj,
      number_of_installments: installments,
    });
    setStep(2);
  };

  const handleSubmit = async (sendSms = false, sendEmail = false) => {
    const { dispatch, credentials, customer } = props;
    const { accountId } = customer;
    const { first_payment_amount, first_payment_date, number_of_installments } =
      submitDataObj;

    try {
      await dispatch(
        generateSplitInvoice(
          accountId,
          first_payment_amount,
          first_payment_date,
          number_of_installments,
          credentials,
          sendEmail,
          sendSms,
          true,
        ),
      );
      if (step === 3) return;
      dispatch(
        showToast({
          message: translate('paymentModal.payment.installments.sucess'),
          style: 'sucess',
        }),
      );
      setStep(3);
      return;
    } catch {
      dispatch(setAgreementSendingSmsOrEmail(false));
      dispatch(
        showToast({
          message: translate('paymentModal.payment.installments.error'),
          style: 'error',
        }),
      );
      if (sendSms) setHasSentSMS(false);
      if (sendEmail) setHasSentEmail(false);
    }
  };

  const handleCopy = () => {
    if (!bankslipEl.current) return false;
    select(bankslipEl.current);
    document.execCommand('copy');
    unselect();
    setHasCopied(true);
  };

  const handleSendBySMS = () => {
    setHasSentSMS(true);
    const { dispatch } = props;
    dispatch(setAgreementSendingSmsOrEmail());
    handleSubmit(true, false);
  };

  const handleSendByEmail = () => {
    setHasSentEmail(true);
    const { dispatch } = props;
    dispatch(setAgreementSendingSmsOrEmail());
    handleSubmit(false, true);
  };

  const getInitialLayout = (summary, dueDates) => {
    const { statements } = summary;
    const { dates } = dueDates;
    if (!statements || !dates) return false;
    const dateIndex = selectionsDateIndex.findIndex((date) => date);

    return (
      <>
        <p data-testid="title-initial">
          <FormattedMessage id="paymentModal.agreement.contemplated" />
        </p>
        <Spacer />
        <InvoiceUl data-testid="invoices-ul-initial">
          {statements.map((item, index) => (
            <InvoiceLi key={`${item.month}-${item.year}-${index}`}>
              <InvoiceDesc>
                <FormattedDate
                  timezone="America/Sao_Paulo"
                  value={compensateDate(new Date(item.year, item.month))}
                  month="long"
                  year="numeric"
                />
              </InvoiceDesc>
              <InvoiceValue>
                <FormattedNumber
                  value={item.amount}
                  style="currency"
                  currency={currency}
                  currencyDisplay="code"
                />
              </InvoiceValue>
            </InvoiceLi>
          ))}
          <InvoiceLi>
            <InvoiceDesc>
              <FormattedMessage id="paymentModal.agreement.interests.discount" />
            </InvoiceDesc>
            <InvoiceValue data-testid="invoices-discount-initial">
              -{' '}
              <FormattedNumber
                value={summary.total_interest_amount_discount}
                style="currency"
                currency={currency}
                currencyDisplay="code"
              />
            </InvoiceValue>
          </InvoiceLi>
          <InvoiceTotal>
            <span>Total</span>
            <InvoiceValue data-testid="invoices-total-initial">
              <FormattedNumber
                value={summary.total_due_amount}
                style="currency"
                currency={currency}
                currencyDisplay="code"
              />
            </InvoiceValue>
          </InvoiceTotal>
        </InvoiceUl>
        <Spacer />
        <TextContainer>
          <FormattedMessage id="paymentModal.payment.entrance" />
        </TextContainer>
        <TextInput
          value={Number(inputValue)}
          type="currency"
          alignCenter
          className="f2dot5 fw4"
          onChange={handleChange}
        />
        <TextMinimum inputValueError={inputValueError}>
          <FormattedMessage id="minimumPayment" />:{' '}
          <FormattedNumber
            value={summary.min_upfront_amount}
            style="currency"
            currency={currency}
            currencyDisplay="code"
          />
        </TextMinimum>
        <Spacer />
        <TextContainer>
          <FormattedMessage id="paymentModal.payment.entrance.date" />
        </TextContainer>
        <InvoiceUl data-testid="invoices-dates-initial">
          <ScrollContainer>
            <PerfectScrollbar>
              {dates.map((dateItem, index) => (
                <InvoiceLi key={`${dateItem}-${index}`}>
                  <ButtonDate
                    onClick={() => setSelectionDate(index)}
                    data-testid={`invoices-dates-select-initial-${index}`}
                  >
                    <IconContainer>
                      {selectionsDateIndex[index] ? (
                        <MdCheckCircle />
                      ) : (
                        <MdRadioButtonUnchecked />
                      )}
                    </IconContainer>
                    <FormattedDate
                      timezone="America/Sao_Paulo"
                      value={compensateDate(new Date(dateItem))}
                      day="numeric"
                      month="numeric"
                      year="numeric"
                    />
                  </ButtonDate>
                </InvoiceLi>
              ))}
            </PerfectScrollbar>
          </ScrollContainer>
        </InvoiceUl>
        <ButtonAdvance
          disabled={inputValueError || dateIndex === -1}
          onClick={() =>
            handleGetAgreementConditions(
              summary.min_upfront_amount,
              dates,
              selectionsDateIndex,
            )
          }
          data-testid="invoices-advance-initial"
        >
          <FormattedMessage id="paymentModal.advance" />
        </ButtonAdvance>
      </>
    );
  };

  const getInstallmentsLayout = (conditions) => {
    if (!conditions) return false;

    const { installment_options } = conditions;
    const payIndex = selectionInstallmentsIndex.findIndex((instal) => instal);

    return (
      <>
        <TextContainer data-testid="title-installments">
          <FormattedMessage id="paymentModal.payment.installments" />
          <b>
            <FormattedNumber
              value={conditions.financed_amount}
              style="currency"
              currency={currency}
              currencyDisplay="code"
            />
          </b>
        </TextContainer>
        <Spacer />
        <InvoiceUl data-testid="ul-installments">
          <ScrollContainer>
            <PerfectScrollbar>
              {installment_options.map((installment, index) => (
                <InvoiceLi key={`${installment.installment_amount}-${index}`}>
                  <ButtonDate
                    onClick={() => setSelectionInstallments(index)}
                    data-testid={`li-installments-${index}`}
                  >
                    <IconContainer>
                      {selectionInstallmentsIndex[index] ? (
                        <MdCheckCircle />
                      ) : (
                        <MdRadioButtonUnchecked />
                      )}
                    </IconContainer>
                    <TextContainer>
                      {installment.number_of_installments} x{' '}
                      <FormattedNumber
                        value={installment.installment_amount}
                        style="currency"
                        currency={currency}
                        currencyDisplay="code"
                      />
                    </TextContainer>
                  </ButtonDate>
                </InvoiceLi>
              ))}
            </PerfectScrollbar>
          </ScrollContainer>
        </InvoiceUl>
        <Spacer />
        {payIndex > -1 && (
          <div data-testid="last-installment-date">
            <FormattedMessage id="paymentModal.payment.installments.last" />
            <FormattedDate
              timezone="America/Sao_Paulo"
              value={compensateDate(
                new Date(installment_options[payIndex].last_payment_date),
              )}
              day="numeric"
              month="numeric"
              year="numeric"
            />
          </div>
        )}
        <Spacer />
        <ButtonAdvance
          disabled={payIndex === -1}
          onClick={() =>
            handleSetupSubmit(
              installment_options[payIndex].number_of_installments,
            )
          }
          data-testid="installments-advance"
        >
          <FormattedMessage id="paymentModal.advance" />
        </ButtonAdvance>
      </>
    );
  };

  const getSummaryLayout = (conditions) => {
    const {
      first_payment_date,
      installment_options,
      upfront_amount,
      financed_amount,
    } = conditions;
    const payIndex = selectionInstallmentsIndex.findIndex((instal) => instal);
    const { interest } = installment_options[payIndex];
    const tax = installment_options[payIndex].taxes;

    return (
      <>
        <TextContainer left data-testid="title-summary">
          <FormattedMessage
            id="paymentModal.payment.installments.summary.entranceDate"
            values={{
              date: (
                <b>
                  <FormattedDate
                    timezone="America/Sao_Paulo"
                    value={compensateDate(new Date(first_payment_date))}
                    day="numeric"
                    month="numeric"
                    year="numeric"
                  />
                </b>
              ),
            }}
          />
        </TextContainer>
        <Spacer />
        <TextContainer left>
          <FormattedMessage
            id="paymentModal.payment.installments.summary.entranceValue"
            values={{
              value: (
                <b>
                  <FormattedNumber
                    value={upfront_amount}
                    style="currency"
                    currency={currency}
                    currencyDisplay="code"
                  />
                </b>
              ),
            }}
          />
        </TextContainer>
        <Spacer />
        <TextContainer left data-testid="summary-day">
          <FormattedMessage
            id="paymentModal.payment.installments.summary.dates"
            values={{
              day: (
                <b>
                  <FormattedDate
                    timezone="America/Sao_Paulo"
                    value={compensateDate(
                      new Date(installment_options[0].last_payment_date),
                    )}
                    day="numeric"
                  />
                </b>
              ),
            }}
          />
        </TextContainer>
        <Spacer />
        <TextContainer left>
          <FormattedMessage id="paymentModal.payment.installments.summary.values" />{' '}
          :
        </TextContainer>
        <InvoiceUl>
          <InvoiceLi>
            <FormattedMessage id="paymentModal.payment.installments.summary.totalValue" />
            <InvoiceValue data-testid="summary-initial">
              <FormattedNumber
                value={financed_amount}
                style="currency"
                currency={currency}
                currencyDisplay="code"
              />
            </InvoiceValue>
          </InvoiceLi>
          <InvoiceLi>
            <FormattedMessage
              id="paymentModal.payment.installments.summary.interest"
              values={{ tax: interest.interest_rate }}
            />
            <InvoiceValue data-testid="summary-interests">
              <FormattedNumber
                value={interest.total_interest_amount}
                style="currency"
                currency={currency}
                currencyDisplay="code"
              />
            </InvoiceValue>
          </InvoiceLi>
          <InvoiceLi>
            <FormattedMessage id="paymentModal.payment.installments.summary.taxes" />
            <InvoiceValue data-testid="summary-tax">
              <FormattedNumber
                value={tax.total_iof_amount}
                style="currency"
                currency={currency}
                currencyDisplay="code"
              />
            </InvoiceValue>
          </InvoiceLi>
          <InvoiceLi>
            <FormattedMessage id="paymentModal.payment.installments.summary.totalInInstallments" />
            <InvoiceValue data-testid="summary-total">
              <FormattedNumber
                value={installment_options[payIndex].total_amount}
                style="currency"
                currency={currency}
                currencyDisplay="code"
              />
            </InvoiceValue>
          </InvoiceLi>
        </InvoiceUl>
        <Spacer />
        <TextContainer data-testid="summary-final">
          <FormattedMessage
            id="paymentModal.payment.installments.summary.final"
            values={{
              payments: (
                <b>{installment_options[payIndex].number_of_installments} x </b>
              ),
              value: (
                <b>
                  <FormattedNumber
                    value={installment_options[payIndex].installment_amount}
                    style="currency"
                    currency={currency}
                    currencyDisplay="code"
                  />
                </b>
              ),
            }}
          />
        </TextContainer>
        <Spacer />
        <LegalContainer>
          <TextContainer>
            <FormattedMessage
              id="paymentModal.payment.installments.summary.legalTextCet"
              values={{
                cet_month:
                  installment_options[payIndex].cet.per_month_percentage,
                cet_anual:
                  installment_options[payIndex].cet.per_year_percentage,
              }}
            />
            <br />
            <Spacer />
            <FormattedMessage
              id="paymentModal.payment.installments.summary.legalTextInterests"
              values={{
                interests_month: interest.interest_rate,
                interests_anual: interest.annual_interest_rate,
              }}
            />
          </TextContainer>
        </LegalContainer>
        <Spacer />
        <ButtonAdvance
          onClick={() => handleSubmit()}
          data-testid="summary-advance"
        >
          <FormattedMessage id="paymentModal.advance" />
        </ButtonAdvance>
      </>
    );
  };

  const getBakslipCodeLayout = (conclusion) => (
    <>
      <TextContainer data-testid="bankslip-title">
        <FormattedMessage id="paymentModal.validUntil" />
        :&nbsp;
        <FormattedDate
          timezone="America/Sao_Paulo"
          value={conclusion.due_date}
          day="2-digit"
          month="long"
        />
      </TextContainer>
      <Spacer />
      <TextTitle data-testid="bankslip-value">
        <FormattedNumber
          value={conclusion.amount}
          style="currency"
          currency={currency}
          currencyDisplay="code"
        />
      </TextTitle>
      <Spacer />
      <TextContainer>
        <FormattedMessage id="paymentModal.instructions" />
      </TextContainer>
      <Spacer />
      <TextContainer>
        <FormattedMessage id="paymentModal.warningBankslip" />
      </TextContainer>
      <Spacer />
      <TextContainer data-testid="bankslip-code" ref={bankslipEl}>
        {conclusion.bankslip}
      </TextContainer>
      <Spacer />
      <ButtonAdvance onClick={handleCopy} w90>
        <FormattedMessage
          id={`paymentModal.${hasCopied ? 'copied' : 'copy'}`}
        />
      </ButtonAdvance>
      <Spacer />
      <ButtonAction
        onClick={handleSendBySMS}
        pressed={hasSentSMS && !isSendingSmsOrEmail}
        data-testid="bankslip-sms"
      >
        {isSendingSmsOrEmail ? (
          <Loader size="extra-small" />
        ) : (
          <FormattedMessage
            id={`paymentModal.${hasSentSMS ? 'sentBySMS' : 'sendBySMS'}`}
          />
        )}
      </ButtonAction>
      <ButtonAction
        onClick={handleSendByEmail}
        pressed={hasSentEmail && !isSendingSmsOrEmail}
        data-testid="bankslip-email"
      >
        {isSendingSmsOrEmail ? (
          <Loader size="extra-small" />
        ) : (
          <FormattedMessage
            id={`paymentModal.${hasSentEmail ? 'sentByEmail' : 'sendByEmail'}`}
          />
        )}
      </ButtonAction>
    </>
  );

  const getLayoutForCurrentStep = (
    summary,
    dueDates,
    conditions,
    conclusion,
  ) => {
    if (isLoading) return <Loader />;
    switch (step) {
      case 0:
        return getInitialLayout(summary, dueDates);

      case 1:
        return getInstallmentsLayout(conditions);

      case 2:
        return getSummaryLayout(conditions);

      case 3:
        return getBakslipCodeLayout(conclusion);
      default:
        return false;
    }
  };

  return (
    <GeneralContainer>
      <ButtonBack>
        <Button onClick={() => handleBack(false)}>
          <MdKeyboardBackspace />
        </Button>
      </ButtonBack>
      <TextTitle>
        <FormattedMessage id="paymentModal.payment.agreement" />
      </TextTitle>
      <ButtonClose>
        <Button onClick={() => handleBack(true)}>
          <MdClose />
        </Button>
      </ButtonClose>
      <Spacer />
      {getLayoutForCurrentStep(summary, dueDates, conditions, conclusion)}
    </GeneralContainer>
  );
};

export default injectIntl(AgreementSummary);
