/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';

import { Loader, Select } from '../commons';
import SimpleModal from '../SimpleModal';

class AddressHistoryChangesModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      typeAddress: 'RESIDENTIAL',
      statusAddress: 'INACTIVE',
    };
  }

  handleClose = () => this.props.onClose();

  changeAddressTypeHandler = (event) => {
    this.setState({
      typeAddress: event.target.value,
    });
  };

  changeAddressStatusHandler = (event) => {
    this.setState({
      statusAddress: event.target.value,
    });
  };

  render() {
    const { typeAddress, statusAddress } = this.state;

    const { customerAddressesHistory, intl } = this.props;
    const { addresses, isLoading, error, errorMsg } = customerAddressesHistory;

    const _fm = (id) => intl.formatMessage({ id });

    const defaultAddressTypes = ['RESIDENTIAL', 'COMMERCIAL', 'OTHER', 'ALL'];
    const defaultAddressStatus = ['ACTIVE', 'INACTIVE', 'ALL'];

    let content = (
      <div className="ph4 h5 center overflow-auto">
        {addresses
          .filter((address) => {
            const { active, addressType: type } = address;
            const status = active === true ? 'ACTIVE' : 'INACTIVE';

            if (statusAddress === 'ALL' && typeAddress === 'ALL') {
              return address;
            }
            if (statusAddress === 'ALL' && type === typeAddress) {
              return address;
            }
            if (typeAddress === 'ALL' && status === statusAddress) {
              return address;
            }
            if (status === statusAddress && type === typeAddress) {
              return address;
            }
          })
          .map((address, key) => {
            const {
              active,
              address: address1,
              address2,
              address3,
              addressType,
              city,
              country,
              creationDate,
              lastUpdate,
              number,
              state,
              zipcode,
              id,
            } = address;

            const addressTypeIntlKey = `formLabels.address.${addressType.toLowerCase()}`;

            return (
              <div key={id} className="b--pismo-lighter-gray bb pv2">
                <p>
                  <span className="b">
                    {key + 1} - <FormattedMessage id={addressTypeIntlKey} /> -{' '}
                    {active ? (
                      <FormattedMessage id="formLabels.active" />
                    ) : (
                      <FormattedMessage id="formLabels.inactive" />
                    )}
                  </span>
                </p>
                <p>
                  <span className="b">
                    <FormattedMessage id="formLabels.addressCreationDate" />:
                  </span>{' '}
                  {creationDate && <FormattedDate value={creationDate} />}
                </p>
                <p>
                  <span className="b">
                    <FormattedMessage id="formLabels.addressLastUpdate" />:
                  </span>{' '}
                  {lastUpdate && <FormattedDate value={lastUpdate} />}
                </p>
                <p>
                  <span className="db">
                    <FormattedMessage id="formLabels.address" />: {address1}
                  </span>
                  <span className="db">
                    <FormattedMessage id="formLabels.number" />: {number}
                  </span>
                  <span className="db">
                    <FormattedMessage id="formLabels.complementary_address" />:{' '}
                    {address2}
                  </span>
                  <span className="db">
                    <FormattedMessage id="formLabels.neighborhood" />:{' '}
                    {address3}
                  </span>
                  <span className="db">
                    <FormattedMessage id="formLabels.city" />: {city}
                  </span>
                  <span className="db">
                    <FormattedMessage id="formLabels.state" />: {state}
                  </span>
                  <span className="db">
                    <FormattedMessage id="formLabels.country" />: {country}
                  </span>
                  <span className="db">
                    <FormattedMessage id="formLabels.zipcode" />: {zipcode}
                  </span>
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

    if (!addresses.length && error) {
      content = (
        <div className="pv1 f6">
          <div className="pa4 f6 f5-ns tc dark-red animate-all">
            {errorMsg || <FormattedMessage id="formLabels.genericErrorMsg" />}
          </div>
        </div>
      );
    }

    if (!addresses.length) {
      content = (
        <div className="pv1 f6">
          <div className="pa4 f4-ns tc pismo-light-silver animate-all">
            <FormattedMessage id="formLabels.noAddressRegistered" />
          </div>
        </div>
      );
    }

    return (
      <SimpleModal
        title="formLabels.titleAddressHistoryChangesModal"
        onClose={this.handleClose}
      >
        <div className="ph4 db">
          <div className="pr2 w-60 fl">
            <Select
              id="type"
              label={_fm('formLabels.type')}
              value={typeAddress}
              onChange={this.changeAddressTypeHandler}
            >
              {defaultAddressTypes &&
                defaultAddressTypes.map((addressType, k) => {
                  const addressTypeIntlKey = `formLabels.address.${addressType.toLowerCase()}`;
                  return (
                    <option value={addressType} key={k}>
                      {_fm(addressTypeIntlKey)}
                    </option>
                  );
                })}
            </Select>
          </div>
          <div className="w-40 fl">
            <Select
              id="type"
              label={_fm('formLabels.status')}
              value={statusAddress}
              onChange={this.changeAddressStatusHandler}
            >
              {defaultAddressStatus &&
                defaultAddressStatus.map((addressStatus, k) => {
                  const addressStatusIntlKey = `formLabels.${addressStatus.toLowerCase()}`;
                  return (
                    <option value={addressStatus} key={k}>
                      {_fm(addressStatusIntlKey)}
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

const mapStateToProps = ({ customerAddressesHistory }, props) => ({
  customerAddressesHistory,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(AddressHistoryChangesModal));
