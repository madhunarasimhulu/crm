import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import classnames from 'classnames';
import get from 'lodash.get';

import { Loader, Select } from '../commons';
import SimpleModal from '../SimpleModal';
import { FormatMoney } from '..';

class NewCardModal extends Component {
  state = {
    selectedReasonId: null,
    success: null,
    error: null,
    isSubmitting: false,
  };

  handleReason = (event) =>
    this.setState({ selectedReasonId: Number(event.target.value) });

  translate = (id) => this.props.intl.formatMessage({ id });

  handleSubmit = (event) => {
    event.preventDefault();

    const { onSubmit } = this.props;
    const { selectedReasonId: reasonId } = this.state;

    this.setState({ isSubmitting: true });
    onSubmit({ reasonId })
      .then(() => {
        this.setState({ isSubmitting: false, success: true });
      })
      .catch(() => {
        this.setState({ isSubmitting: false, error: true });
      });
  };

  getReasonCost = (reasonId) =>
    get(
      this.props.options.find(({ id } = {}) => id === reasonId),
      'cost',
      null,
    );

  render() {
    const { selectedReasonId, success, error, isSubmitting } = this.state;
    const { options, onClickClose, address } = this.props;
    const submitBtnClasses = classnames(
      'button-reset br0 bn white fw4 db w-100 pa3 f6',
      {
        ttu: !success,
        'bg-pismo-dark-gray noclick': isSubmitting && !success,
        'bg-pismo-yellow pointer': !isSubmitting && !success,
        'bg-red noclick': error,
        'bg-green noclick': success,
      },
    );
    const selectedReasonCost = this.getReasonCost(selectedReasonId);

    const {
      address: address1,
      address2,
      address3,
      city,
      country,
      number,
      state,
      zipcode,
    } = address;

    return (
      <SimpleModal
        title="cards.newCard.title"
        onClose={onClickClose}
        childrenContainerClasses="pt4 fw4 f6 tc"
      >
        <form
          className="flex flex-column items-center"
          name="newCardForm"
          onSubmit={this.handleSubmit}
        >
          <div className="w-80">
            <p className="ttu pismo-darker-blue ma0 pa0">
              {this.translate('cards.newCard.addressTitle')}
            </p>
            <p className="mv4 b">
              {address1}, {number}, {address2 && `${address2}, `}
              {address3 && `${address3}, `} <br />
              {city} - {state}, {country}, {zipcode}
            </p>

            {isSubmitting ? (
              <div className="mb4">
                <Loader size="small" />
              </div>
            ) : (
              <div className="ma4">
                <Select
                  name="newCardReason"
                  value={selectedReasonId}
                  onChange={this.handleReason}
                  required
                >
                  <option value="">
                    {this.translate('cards.newCard.selectReason')}
                  </option>
                  {options.map(({ id, description }) => (
                    <option value={id} key={id}>
                      {description}
                    </option>
                  ))}
                </Select>
                {selectedReasonCost && (
                  <div>
                    <p className="ttu pismo-darker-blue ma4 pa0">
                      {this.translate('cards.newCard.costExplanation')}
                    </p>
                    <h2 className="f5 ttu pismo-darker-blue mt4 pa0">
                      <FormatMoney
                        value={parseFloat(selectedReasonCost)}
                        showSymbol
                      />
                    </h2>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type={isSubmitting || success ? 'button' : 'submit'}
            onClick={selectedReasonId === 0 ? null : this.handleSubmit}
            className={submitBtnClasses}
          >
            {this.translate(
              isSubmitting
                ? 'submitting'
                : success
                ? 'submitted'
                : error
                ? 'failedToSubmit'
                : 'confirm',
            )}
          </button>
        </form>
      </SimpleModal>
    );
  }
}

export default injectIntl(NewCardModal);
