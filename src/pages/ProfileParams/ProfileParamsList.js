import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import CurrencyInput from 'react-currency-input';
import { withRouter } from 'react-router';
import {
  editingAccountParameter,
  updatingAccountParameter,
  savingAccountParameter,
  resetEditAccountParameter,
  updateDueDate,
  getCustomerAccount,
  getAccountParameters,
  setCustomerParams,
  showToast,
} from '../../actions';
import { formatValue, getRequestErrorMessage } from '../../utils';

class ProfileParameterList extends Component {
  constructor(props) {
    super(props);
    this.resetAccountParameter = this.resetAccountParameter.bind(this);
  }

  static defaultProps = {
    editable: false,
    item: {},
  };

  static propTypes = {
    editable: PropTypes.bool,
    item: PropTypes.object,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    const { keyCode } = event;
    if (keyCode !== 27) {
      return false;
    }
    return this.resetAccountParameter();
  };

  resetAccountParameter = () => {
    const { dispatch } = this.props;
    dispatch(resetEditAccountParameter());
  };

  setParameterEditable = () => {
    const {
      name,
      item: { parameter_id: id, value },
      editable,
      profileParams: {
        dueDateAvaliables,
        editing: { id: editingId },
      },
    } = this.props;

    if (!editable) {
      return false;
    }

    if (editingId) {
      return false;
    }

    const params = {
      id,
      name,
      value: value !== null ? value : dueDateAvaliables[0].id,
    };

    this.props.dispatch(editingAccountParameter(params));
  };

  editParameterEditable = ({
    nativeEvent: {
      target: { value: nextValue },
    },
  }) => this.props.dispatch(updatingAccountParameter({ nextValue }));

  updateParameterValue = () => {
    const {
      type,
      dispatch,
      credentials,
      customer: {
        program: { id: programId },
      },
      match: {
        params: { accountId, customerId },
      },
      profileParams: {
        editing: { id, nextValue },
      },
      org,
    } = this.props;

    const action = {
      select: () =>
        dispatch(
          updateDueDate(
            nextValue,
            programId,
            customerId,
            accountId,
            credentials,
          ),
        ),
      number: () =>
        dispatch(
          savingAccountParameter(Number(nextValue), id, accountId, credentials),
        ),
      default: () =>
        dispatch(
          savingAccountParameter(
            formatValue(nextValue, org.currency),
            id,
            accountId,
            credentials,
          ),
        ),
    };

    action[type || 'default']()
      .then(dispatch(showToast(this.translate('profile.parameter.success'))))
      .then(() =>
        dispatch(getCustomerAccount(customerId, accountId, credentials)).then(
          ({ contract, credit_limits, account }) => {
            dispatch(
              setCustomerParams({ ...contract, ...credit_limits, ...account }),
            );
            dispatch(getAccountParameters(accountId, credentials));
          },
        ),
      )
      .catch((err) => {
        dispatch(
          showToast({
            message:
              getRequestErrorMessage(err) ||
              this.translate('general.update.fail'),
            style: 'error',
          }),
        );
      })
      .finally(dispatch(resetEditAccountParameter()));
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const {
      index,
      item,
      value,
      name,
      editable,
      type,
      org,
      profileParams: {
        dueDateAvaliables,
        editing: { id, nextValue },
      },
    } = this.props;

    const inputClasses = `
      input-reset dib ph2 pv1 bb bw1 mw4-l mw-50
      pismo-near-black bg-pismo-light-gray
      b--pismo-gray hover-bg-white
      hover-b--pismo-near-black hover-shadow-pismo-1
      animate-all br0 Input
    `;
    const buttonClasses = `
      f6 bn link ml2 ml1-l br2 ph2 pv2
      dib white bg-pismo-dark-yellow
      pointer ttu
      f7 f6-l
    `;

    const resetButtonClasses = `
      f6 bn link ml2-l br2 ph2 pv2
      dib white bg-pismo-dark-gray
      pointer ttu
      f7 f6-l
    `;
    let disabledItem = '';
    if (id) {
      if (id === item.parameter_id || id === name) {
        disabledItem = 'items-center selected';
      } else {
        disabledItem = 'noclick';
      }
    }

    return (
      <li
        // onClick={this.setParameterEditable}
        key={index}
        className={`ph3 pv2dot6 pv3dot4-ns mv0 bb
        ${
          editable && !id
            ? 'pointer hover-bg-pismo-dark-blue hover-pismo-near-white'
            : ''
        }
        ${id ? 'editing' : ''}
        ${disabledItem}`}
      >
        <div className="dib v-mid w-50 f7 f6-ns">{name}</div>
        <div className="dib v-mid w-50 tr f6 f5-ns">
          {id === item.parameter_id || id === name ? (
            <span>
              {type === 'input-text' && (
                <div className="dib-l">
                  <CurrencyInput
                    className={inputClasses}
                    value={nextValue}
                    prefix={org.currency}
                    decimalSeparator={org.separatorDecimals || '.'}
                    thousandSeparator={org.separatorThousands || ','}
                    onChangeEvent={this.editParameterEditable}
                  />
                </div>
              )}
              {type === 'number' && (
                <div className="dib-l">
                  <input
                    className={inputClasses}
                    value={nextValue || 0}
                    type="number"
                    onChange={this.editParameterEditable}
                  />
                  %
                </div>
              )}
              {type === 'select' && (
                <select
                  onChange={this.editParameterEditable}
                  className={inputClasses}
                  disabled={true}
                >
                  {dueDateAvaliables.map((option, key) => (
                    <option
                      selected={value === option.day}
                      value={option.id}
                      key={key}
                    >
                      {option.day}
                    </option>
                  ))}
                </select>
              )}
              <div className="dn dib-l">
                <button
                  onClick={this.resetAccountParameter}
                  className={resetButtonClasses}
                >
                  {this.translate(`cancel`)}
                </button>
                <button
                  // onClick={this.updateParameterValue}
                  onClick={() => {}}
                  className={buttonClasses}
                >
                  {this.translate(`save`)}
                </button>
              </div>
            </span>
          ) : (
            <span>{value}</span>
          )}
        </div>
        <div
          className={`${
            id && (id === item.parameter_id || id === name)
              ? 'db dn-l pv1 tc mt2'
              : 'dn'
          }`}
        >
          <button
            onClick={this.resetAccountParameter}
            className={resetButtonClasses}
          >
            {this.translate(`cancel`)}
          </button>
          <button onClick={this.updateParameterValue} className={buttonClasses}>
            {this.translate(`save`)}
          </button>
        </div>
      </li>
    );
  }
}

const mapStateToProps = (
  { credentials, customer, profileParams, cards, intl, org },
  props,
) => ({
  credentials,
  customer,
  profileParams,
  intl,
  cards,
  org,
  ...props,
});

export default connect(mapStateToProps)(
  withRouter(injectIntl(ProfileParameterList)),
);
