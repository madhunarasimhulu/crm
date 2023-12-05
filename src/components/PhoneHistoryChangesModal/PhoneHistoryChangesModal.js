/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';

import { Loader, Select } from '../commons';
import SimpleModal from '../SimpleModal';
import { formatPhone } from '../../utils';

class PhoneHistoryChangesModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      typePhone: 'RESIDENTIAL',
      statusPhone: 'INACTIVE',
    };
  }

  handleClose = () => this.props.onClose();

  changePhoneTypeHandler = (event) => {
    this.setState({
      typePhone: event.target.value,
    });
  };

  changePhoneStatusHandler = (event) => {
    this.setState({
      statusPhone: event.target.value,
    });
  };

  render() {
    const { typePhone, statusPhone } = this.state;

    const { customerPhonesHistory, intl } = this.props;
    const { phones, isLoading, error, errorMsg } = customerPhonesHistory;

    const _fm = (id) => intl.formatMessage({ id });

    const defaultPhoneTypes = ['RESIDENTIAL', 'COMMERCIAL', 'MOBILE', 'ALL'];
    const defaultPhoneStatus = ['ACTIVE', 'INACTIVE', 'ALL'];

    let content = (
      <div className="ph4 h5 center overflow-auto">
        {phones
          .filter((phone) => {
            const { active, type } = phone;
            const status = active === true ? 'ACTIVE' : 'INACTIVE';

            if (statusPhone === 'ALL' && typePhone === 'ALL') {
              return phone;
            }
            if (statusPhone === 'ALL' && type === typePhone) {
              return phone;
            }
            if (typePhone === 'ALL' && status === statusPhone) {
              return phone;
            }
            if (status === statusPhone && type === typePhone) {
              return phone;
            }
          })
          .map((phone, key) => {
            const {
              active,
              areaCode,
              creationDate,
              extension,
              id,
              lastUpdate,
              phone: phoneNumber,
              type,
            } = phone;

            const phoneTypeIntlKey = `formLabels.phone.${type.toLowerCase()}`;

            return (
              <div key={id} className="b--pismo-lighter-gray bb pv2">
                <p>
                  <span className="b">
                    {key + 1} - <FormattedMessage id={phoneTypeIntlKey} /> -{' '}
                    {active ? (
                      <FormattedMessage id="formLabels.active" />
                    ) : (
                      <FormattedMessage id="formLabels.inactive" />
                    )}
                  </span>
                </p>
                <p>
                  <span className="b">
                    <FormattedMessage id="formLabels.phoneCreationDate" />:
                  </span>{' '}
                  {creationDate && <FormattedDate value={creationDate} />}
                </p>
                <p>
                  <span className="b">
                    <FormattedMessage id="formLabels.phoneLastUpdate" />:
                  </span>{' '}
                  {lastUpdate && <FormattedDate value={lastUpdate} />}
                </p>
                <p>
                  <FormattedMessage id="formLabels.phone" />:{' '}
                  {formatPhone(`${areaCode}${phoneNumber}`)}{' '}
                  {extension && `- ${extension}`}
                </p>
              </div>
            );
          })}
      </div>
    );

    if (isLoading) {
      content = (
        <div className="pv1 f6">
          <div className="pa4 f4-ns tc pismo-light-silver animate-all">
            <Loader size="small" />
          </div>
        </div>
      );
    }

    if (!phones.length && error) {
      content = (
        <div className="pv1 f6">
          <div className="pa4 f6 f5-ns tc dark-red animate-all">
            {errorMsg || <FormattedMessage id="formLabels.genericErrorMsg" />}
          </div>
        </div>
      );
    }

    if (!phones.length) {
      content = (
        <div className="pv1 f6">
          <div className="pa4 f4-ns tc pismo-light-silver animate-all">
            <FormattedMessage id="formLabels.noPhoneRegistered" />
          </div>
        </div>
      );
    }

    return (
      <SimpleModal
        title="formLabels.titlePhoneHistoryChangesModal"
        onClose={this.handleClose}
      >
        <div className="ph4 db">
          <div className="pr2 w-60 fl">
            <Select
              id="type"
              label={_fm('formLabels.type')}
              value={typePhone}
              onChange={this.changePhoneTypeHandler}
            >
              {defaultPhoneTypes &&
                defaultPhoneTypes.map((phoneType, k) => {
                  const phoneTypeIntlKey = `formLabels.phone.${phoneType.toLowerCase()}`;
                  return (
                    <option value={phoneType} key={k}>
                      {_fm(phoneTypeIntlKey)}
                    </option>
                  );
                })}
            </Select>
          </div>
          <div className="w-40 fl">
            <Select
              id="type"
              label={_fm('formLabels.status')}
              value={statusPhone}
              onChange={this.changePhoneStatusHandler}
            >
              {defaultPhoneStatus &&
                defaultPhoneStatus.map((phoneStatus, k) => {
                  const phoneStatusIntlKey = `formLabels.${phoneStatus.toLowerCase()}`;
                  return (
                    <option value={phoneStatus} key={k}>
                      {_fm(phoneStatusIntlKey)}
                    </option>
                  );
                })}
            </Select>
          </div>
        </div>
        {content}
      </SimpleModal>
    );
  }
}

const mapStateToProps = ({ customerPhonesHistory }, props) => ({
  customerPhonesHistory,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(PhoneHistoryChangesModal));
