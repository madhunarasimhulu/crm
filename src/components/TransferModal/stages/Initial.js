import { useState } from 'react';

import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import Slider from 'rc-slider/lib/Slider';
import { TextInput } from '../../commons';
import { FormatMoney } from '../..';
import stylesModal from '../TransferModal.module.css';

const Initial = ({ limit_transfer, onNext, amount }) => {
  const [inputAmount, setInputAmount] = useState(amount);

  return (
    <div className="w-70 center">
      <h3 className="f3 fw4" style={{ textAlign: 'left' }}>
        <FormattedMessage id={'transfer-modal-amount-value'} />
      </h3>
      <TextInput
        type="currency"
        value={inputAmount}
        alignCenter
        className={`f2dot5`}
        onChange={(event) => setInputAmount(event.target.value)}
      />
      <div className="pismo-mid-gray mt4">
        <div className="dib v-mid w-50 tl">
          <FormatMoney value={0} />
        </div>
        <div className="dib v-mid w-50 tr">
          <FormatMoney value={limit_transfer} />
        </div>
      </div>
      <Slider
        min={0}
        max={limit_transfer}
        step={0.01}
        defaultValue={amount}
        onChange={(amount) => setInputAmount(amount)}
      />
      <div className="mt4">
        <button
          onClick={() => onNext({ amount: inputAmount })}
          href
          className={`${stylesModal['btn-transfer']} `}
          disabled={inputAmount <= 0}
        >
          <FormattedMessage id={'transfer-modal-transfer'} />
        </button>
      </div>
    </div>
  );
};

export default injectIntl(Initial);
