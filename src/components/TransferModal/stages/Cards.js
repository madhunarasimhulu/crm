import { useEffect, useState } from 'react';

import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import stylesModal from '../TransferModal.module.css';
import getCustomers from '../../../actions/getCustomersV2';
import { Cards as CardsClient } from '../../../clients';
import { Programs } from '../../../clients';
import { connect } from 'react-redux';

import { Loader } from 'components/commons';
import Card from './Card';

const Cards = ({ onNext, dispatch, customer, credentials }) => {
  const [accountSelected, setAccountSelected] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBrandName = (program_id) => {
    switch (program_id) {
      case 2:
        return 'master';
      case 3:
        return 'visa';
      default:
        return null;
    }
  };

  const { entity } = customer;

  useEffect(() => {
    setLoading(true);

    dispatch(getCustomers(entity.document_number, credentials)).then(
      async (result) => {
        const cards = await Promise.all(
          result
            .filter(
              (account) =>
                account.last_card_id &&
                customer.accountId !== account.account_id,
            )
            .map((account) =>
              CardsClient.getCard(account.last_card_id, credentials),
            ),
        );

        const programs = await Promise.all(
          cards.map((card) =>
            Programs.getProgram(card.program.id, credentials),
          ),
        );

        const accounts = programs.map((program, index) => ({
          id: cards[index].account.id,
          card: cards[index],
          program: {
            brand_name: getBrandName(program.brand_id),
            ...program,
          },
        }));

        setAccounts(accounts);

        if (cards?.length === 1) {
          setAccountSelected(accounts[0]);
        }

        setLoading(false);
      },
    );

    return () => {
      setLoading(false);
      setAccountSelected(null);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="tw-mt-5 tw-px-7">
        <h3 className="f3 fw4" style={{ textAlign: 'left' }}>
          <FormattedMessage id="transfer-modal-card-select" />
        </h3>
        {loading && <Loader size="small" />}
        {!loading &&
          accounts.map((account) => {
            return (
              <Card
                key={account.id}
                account={account}
                onSelect={setAccountSelected}
                selected={accountSelected && accountSelected.id === account.id}
              />
            );
          })}
        {!loading && !accounts?.length && (
          <FormattedMessage id="transfer-modal-nocards" />
        )}
      </div>
      <div className="mt4">
        <button
          onClick={() => onNext({ accountSelected })}
          href
          className={`${stylesModal['btn-transfer']} `}
          disabled={loading || !accountSelected}
        >
          <FormattedMessage id={'transfer-modal-select'} />
        </button>
      </div>
    </>
  );
};

const mapStateToProps = ({ customer, credentials }, props) => ({
  customer,
  credentials,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(Cards));
