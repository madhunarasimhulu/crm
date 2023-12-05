import { useState } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { MdArrowBack, MdClose } from 'react-icons/md';
import Initial from './stages/Initial';
import Cards from './stages/Cards';
import Resume from './stages/Resume';
import { Loader } from 'components/commons';
import { Payments } from '../../clients';

const TransferModal = ({
  limit_transfer,
  onSuccess,
  onError,
  onClose,
  customer,
  user,
}) => {
  const [stage, setStage] = useState('initial');
  const [amount, setAmount] = useState(0);
  const [accountDestination, setAccountDestination] = useState(null);

  const ButtonToStage = ({ toStage }) => (
    <div className="absolute top-0 left-1 mt1" style={{ marginTop: '12px' }}>
      <button
        type="button"
        className="button-reset bn bg-transparent pointer f4"
        onClick={() => setStage(toStage)}
      >
        <MdArrowBack />
      </button>
    </div>
  );

  const ButtonClose = () => (
    <div className="absolute top-0 right-1 mt1" style={{ marginTop: '12px' }}>
      <button
        type="button"
        className="button-reset bn bg-transparent pointer f4"
        onClick={() => onClose()}
      >
        <MdClose />
      </button>
    </div>
  );

  const confirmTransfer = async () => {
    setStage('confirm');

    try {
      const { error } = await Payments.p2p(
        customer.accountId,
        accountDestination.id,
        amount,
        'TRANSFER',
        user,
      );
      if (error) return onError();

      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (e) {
      onError();
    }
  };

  return (
    <>
      {stage === 'initial' && (
        <>
          <ButtonClose />
          <Initial
            amount={amount}
            limit_transfer={limit_transfer}
            onNext={({ amount }) => {
              setAmount(amount);
              setStage('cards');
            }}
          />
        </>
      )}
      {stage === 'cards' && (
        <>
          <ButtonToStage toStage={'initial'} />
          <ButtonClose />
          <Cards
            onNext={({ accountSelected }) => {
              setAccountDestination(accountSelected);
              setStage('resume');
            }}
          />
        </>
      )}
      {stage === 'resume' && (
        <>
          <ButtonToStage toStage={'cards'} />
          <ButtonClose />
          <Resume
            accountDestination={accountDestination}
            amount={amount}
            onConfirm={confirmTransfer}
          />
        </>
      )}
      {stage === 'confirm' && <Loader size="small" />}
    </>
  );
};

const mapStateToProps = ({ customer, intl, user }, props) => ({
  customer,
  user,
  intl,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(TransferModal));
