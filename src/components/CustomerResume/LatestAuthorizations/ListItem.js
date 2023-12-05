import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import { MdShoppingCart } from 'react-icons/md';
import { MdAttachMoney } from 'react-icons/md';
import { FormattedRelativeDate } from '../../commons';
import { FormatMoney } from '../..';

const ListItem = ({ authorization, merchant }) => {
  const { is_credit, is_disputed, operation_name, amount, event_date_utc } =
    authorization;
  const { name: merchantName } = merchant;

  const containerClasses = classnames('flex ph3 pv3dot5', {
    'white bg-inherit': !is_disputed && !is_credit,
    'pismo-gray': is_disputed,
    'pismo-brighter-blue bg-pismo-darker-grayish-blue': is_credit,
  });

  const commonColClasses = 'ph1';
  const mainColClasses = `${commonColClasses} self-start pr2 lh-copy`;
  const iconColClasses = `${commonColClasses} self-start`;
  const dateColClasses = `${commonColClasses} self-start ml-auto pt1dot5`;

  const iconClasses = 'f4 ml1';
  const descriptionClasses = classnames('di v-mid f6 fw4', {
    strike: is_disputed,
  });
  const amountClasses = 'v-mid b';
  const dateClasses = 'f7 fw4';
  const labelClasses =
    'dn di v-mid bg-white br1 pa1 pismo-dark-blue f8 mr1 fw4 normal-ns';

  return (
    <li className={containerClasses}>
      <div className={iconColClasses}>
        <div className={iconClasses}>
          {is_credit ? <MdAttachMoney /> : <MdShoppingCart />}
        </div>
      </div>

      <div className={mainColClasses}>
        {is_disputed && (
          <span className={labelClasses}>
            <FormattedMessage id="transactions.reported" />
          </span>
        )}

        <div className={descriptionClasses}>
          {is_credit ? (
            <span>{operation_name}</span>
          ) : (
            <span>{merchantName}</span>
          )}
          &nbsp;&nbsp;
          <span className={amountClasses}>
            <FormatMoney value={amount} showSymbol />
          </span>
        </div>
      </div>

      <div className={dateColClasses}>
        <div className={dateClasses}>
          <FormattedRelativeDate value={event_date_utc} />
        </div>
      </div>
    </li>
  );
};

export default ListItem;
