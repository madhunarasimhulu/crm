import React, { useState } from 'react';
import { Formik } from 'formik';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Prompt, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { ConfirmationModal } from '../../ConfirmationModal';
import { CloseAccountReasonModal } from '../../CloseAccountReasonModal';
import { BalanceModal } from '../../BalanceModal';
import { BankSlipsOpenedModal } from '../../BankSlipsOpenedModal';
import { SuccessModal } from '../../SuccessModal';
import { ErrorModal } from '../../ErrorModal';
import { Select, Button } from '../../commons';
import {
  closeAccount,
  updateAccountStatus,
  setAccountStatus,
  getAccountReasons,
} from '../../../actions';

import './CustomerChangeStatus.scss';

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

const CustomerChangeStatusComponent = ({
  profileParams,
  dispatch,
  credentials,
  customer,
  intl,
  history,
}) => {
  const translate = (id) => intl.formatMessage({ id });

  const [modalOpened, setModalOpened] = useState(false);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);
  const [successModalOpened, setSuccessModalOpened] = useState(false);
  const [errorModalOpened, setErrorModalOpened] = useState(false);
  const [confirmationDeleteModalOpened, setConfirmationDeleteModalOpened] =
    useState(false);
  const [hasBalanceModalOpened, setHasBalanceModalOpened] = useState(false);
  const [hasBankSlipsOpened, setHasBankSlipsOpened] = useState(false);
  const [reasonId, setReasonId] = useState(null);
  const [comment, setComment] = useState('');

  const [closeAccountReasonModalOpened, setCloseAccountReasonModalOpened] =
    useState(false);
  const [cancellationReasons, setCancellationReasons] = useState([]);

  const openConfirmationModal = () => {
    setConfirmationModalOpened(true);
  };

  const onTryCloseAccount = () => {
    setConfirmationModalOpened(false);
    return dispatch(
      closeAccount({ accountId: customer.accountId }, credentials),
    ).then((response) => {
      if (response.error_code && response.error_code === 'WSGA2023') {
        return setHasBalanceModalOpened(true);
      }

      if (response.error_code) {
        return setHasBankSlipsOpened(true);
      }

      setCancellationReasons([...response.cancellation_reasons]);
      setCloseAccountReasonModalOpened(true);
    });
  };

  const onCloseAccount = () =>
    dispatch(
      closeAccount(
        { accountId: customer.accountId, reasonId, comment },
        credentials,
      ),
    )
      .then((response) => {
        setConfirmationDeleteModalOpened(false);

        if (response.error_code) {
          setModalOpened(false);
          setErrorModalOpened(true);
          return;
        }

        setModalOpened(false);
        setSuccessModalOpened(true);
      })
      .catch(() => {
        setModalOpened(false);
        setErrorModalOpened(true);
      });

  const handleSetCloseAccountReasonModalOpened = () => {
    setCloseAccountReasonModalOpened(false);
  };

  const handleCloaseAccountConfirm = ({ comment, reason }) => {
    setReasonId(reason.id);
    setComment(comment);
    setCloseAccountReasonModalOpened(false);
    setConfirmationDeleteModalOpened(true);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        status: `${customer.account.account_status_id}-${customer.account.account_status}`,
        reason_id: customer && customer.account.status_reason_id,
      }}
      onSubmit={(values, { setSubmitting }) => {
        const newStatus = values.status.split('-');
        values.status = newStatus[1];
        return dispatch(
          updateAccountStatus(
            {
              customerId: customer.customerId,
              accountId: customer.accountId,
              ...values,
            },
            credentials,
          ),
        )
          .then((res) => {
            if (res.error) {
              setModalOpened(false);
              setErrorModalOpened(true);
              return;
            }
            dispatch(setAccountStatus(values.status));
            setModalOpened(false);
            setSuccessModalOpened(true);
          })
          .catch(() => {
            setModalOpened(false);
            setErrorModalOpened(true);
          })
          .finally(() => setSubmitting(false));
      }}
      render={({
        values,
        submitForm,
        isSubmitting,
        handleChange,
        handleBlur,
        errors,
        initialValues,
        dirty,
        setFieldValue,
      }) => {
        const isDirty = () => {
          if (!initialValues || !values) {
            return dirty;
          }

          return JSON.stringify(initialValues) !== JSON.stringify(values);
        };

        const hasValues = Object.keys(values).every((key) => values[key]);
        const hasErrors = Object.keys(errors).length > 0;
        const canSubmit = !isSubmitting && hasValues && !hasErrors && isDirty();

        const checkValue = (value) => {
          values.reason_id = null;
          const [id] = value.split('-');

          setFieldValue('status', value);

          dispatch(getAccountReasons(id, credentials));
        };

        return (
          <div className="CustomerChangeStatus bg-pismo-near-white ph3 pv4">
            {successModalOpened && (
              <SuccessModal
                onClick={() => {
                  setSuccessModalOpened(false);
                  return history.replace(
                    `/customers/${customer.customerId}/accounts/${customer.accountId}/profile/info`,
                  );
                }}
              />
            )}
            {errorModalOpened && (
              <ErrorModal
                message={translate('general.update.fail')}
                onClick={() => {
                  setErrorModalOpened(false);
                  return history.replace(
                    `/customers/${customer.customerId}/accounts/${customer.accountId}/profile/info`,
                  );
                }}
              />
            )}
            {confirmationModalOpened && (
              <ConfirmationModal
                data-testid="customerChangeStatus.confirmationModal"
                isSubmitting={isSubmitting}
                onClose={() => setConfirmationModalOpened(false)}
                onSubmit={onTryCloseAccount}
              />
            )}
            {modalOpened && (
              <ConfirmationModal
                data-testid="customerChangeStatus.confirmationModal"
                isSubmitting={isSubmitting}
                onClose={() => setModalOpened(false)}
                onSubmit={submitForm}
              />
            )}
            {hasBalanceModalOpened && (
              <BalanceModal
                data-testid="customerChangeStatus.balanceModal"
                isSubmitting={isSubmitting}
                onClose={() => setHasBalanceModalOpened(false)}
                onSubmit={() => setHasBalanceModalOpened(false)}
                onClickCashOut={() => null}
                onClickOp={() => null}
                onClickSettings={() => null}
              />
            )}
            {hasBankSlipsOpened && (
              <BankSlipsOpenedModal
                data-testid="customerChangeStatus.bankSlipsModal"
                isSubmitting={isSubmitting}
                onClose={() => setHasBankSlipsOpened(false)}
                onSubmit={() => setHasBankSlipsOpened(false)}
              />
            )}
            {confirmationDeleteModalOpened && (
              <ConfirmationModal
                data-testid="customerChangeStatus.confirmationDeleteModal"
                onClose={() => setConfirmationDeleteModalOpened(false)}
                onSubmit={onCloseAccount}
              />
            )}
            {closeAccountReasonModalOpened && (
              <CloseAccountReasonModal
                reasons={cancellationReasons}
                onClose={handleSetCloseAccountReasonModalOpened}
                onSubmit={handleCloaseAccountConfirm}
              />
            )}
            <h3 data-testid="customerChangeStatus.title">
              {translate('formLabels.customerChangeStatus')}
            </h3>
            <Prompt
              when={isDirty()}
              message={() => translate('general.form.dirty.confirm')}
            />

            <Select
              data-testid="customerChangeStatus.status"
              id="status"
              value={values.status}
              label={translate('formLabels.status')}
              onChange={(e) => checkValue(e.target.value)}
              onBlur={handleBlur}
              disabled={!profileParams.statuses.length}
            >
              {profileParams.statuses
                .map((item) => {
                  const container = { ...item };

                  container.translated = translate(
                    `formLabels.status.${item.name.toLowerCase()}`,
                  );

                  return container;
                })
                .sort((a, b) => (a.translated > b.translated ? 1 : -1))
                .map(({ id, name, translated }) => (
                  <option key={id} value={`${id}-${name}`}>
                    {translated}
                  </option>
                ))}
            </Select>

            <Select
              data-testid="customerChangeStatus.reason"
              id="reason_id"
              value={values.reason_id}
              label={translate('formLabels.reason')}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!profileParams.reasons.length}
            >
              <option value="">{translate('formLabels.choose')}</option>

              {profileParams.reasons
                .sort((a, b) => a.description.localeCompare(b.description))
                .map(({ reason_id, description }) => (
                  <option key={reason_id} value={reason_id}>
                    {description}
                  </option>
                ))}
            </Select>

            <ButtonsWrapper>
              <Button
                text={translate('formLabels.closeAccount')}
                type="button"
                className="button button--back"
                onClick={openConfirmationModal}
                data-testid="customerChangeStatus.closeAccountButton"
                disabled={Boolean(
                  profileParams.options.account_status.match(
                    /(FULL)_CANCELLATION/,
                  ),
                )}
              />
              <div className="CustomerChangeStatus__RowSubmit">
                <Button
                  text={translate('back')}
                  type="button"
                  className="button button--back"
                  onClick={() => window.history.go(-1)}
                  data-testid="customerChangeStatus.backButton"
                />
                <Button
                  disabled={!canSubmit}
                  data-testid="customerChangeStatus.submitButton"
                  text={translate('formLabels.submit')}
                  onClick={() => setModalOpened(true)}
                  className={`button button--save bg-pismo-yellow ${
                    !canSubmit ? 'button--disabled' : ''
                  }`}
                />
              </div>
            </ButtonsWrapper>
          </div>
        );
      }}
    />
  );
};

const mapStateToProps = (
  { customer, credentials, profileParams, ui },
  props,
) => ({
  credentials,
  customer,
  profileParams,
  ui,
  ...props,
});

export const CustomerChangeStatus = compose(
  connect(mapStateToProps),
  injectIntl,
  withRouter,
)(CustomerChangeStatusComponent);
