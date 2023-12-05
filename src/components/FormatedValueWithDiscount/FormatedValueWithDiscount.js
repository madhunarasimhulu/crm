import React, { Fragment } from 'react';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';

import { connect } from 'react-redux';
import { FormatMoney } from '..';

const ValueContainer = styled.div`
  color: ${(props) =>
    [
      'TEMPORARY_ISSUER_LOSS',
      'CLOSED_APPROVED_TEMPORARY_ISSUER_LOSS',
      'CLOSED_ISSUER_LOSS',
    ].includes(props.category)
      ? '#26c33a'
      : '#202732'};
  font-size: 2.3rem;
  font-weight: bold;
  text-align: center;
  margin: 0.3rem 0px 0.5rem;
`;
const ValueDetail = styled.div`
  font-size: 1rem;
  font-weight: 100;
  text-align: center;
  margin: 0.3rem 0px 0.5rem;
  line-height: '1rem';
`;
const CoinText = styled.span`
  font-size: 2.3rem;
  font-weight: 300;
`;
const PriceWithDiscount = styled.span`
  font-size: 2.3rem;
  font-weight: bold;
`;
const PriceWithoutDiscount = styled.span`
  text-decoration: line-through;
  font-size: 1rem;
  font-weight: 100;
`;
const ItiDiscount = styled.span`
  color: #26c33a;
  font-size: 1rem;
  font-weight: 100;
`;
const ValueWithDiscount = (props) => {
  const { amount, iti_discount = 0, category, org } = props;
  const amountWithDiscount = parseFloat(amount) - parseFloat(iti_discount);

  return iti_discount ? (
    <>
      <CoinText>{org.currency}</CoinText>
      <PriceWithDiscount>
        <FormatMoney value={amountWithDiscount} />
      </PriceWithDiscount>
      <ValueDetail>
        <PriceWithoutDiscount>
          <FormatMoney value={amount} />
        </PriceWithoutDiscount>
        <ItiDiscount>
          - {org.currency}
          <FormatMoney value={iti_discount} />{' '}
          <FormattedMessage id="timeline-event-discount-iti" />
        </ItiDiscount>
      </ValueDetail>
    </>
  ) : (
    <ValueContainer category={category}>
      <CoinText>{org.currency}</CoinText>
      <FormatMoney value={amount} />
    </ValueContainer>
  );
};

const mapStateToProps = ({ org }, props) => ({
  org,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(ValueWithDiscount));
