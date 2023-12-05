import stylesCard from './Cards.module.scss';

const Card = ({ account, selected, onSelect }) => (
  <div
    onClick={() => onSelect && onSelect(account)}
    className={`${stylesCard['card']} ${selected && stylesCard['selected']}`}
  >
    <div className={`${stylesCard['card_base']} tw-flex tw-justify-between`}>
      <div className={stylesCard['card_details']}>
        <div className={stylesCard['card_number']}>
          xxxx&nbsp;&nbsp;xxxx&nbsp;&nbsp;xxxx&nbsp;&nbsp;
          <span className={stylesCard['visible']}>
            {account.card.last_4_digits}
          </span>
        </div>
        <div className={stylesCard['card_program']}>
          {account.program.program_name}
        </div>
      </div>
      {account.program.brand_name === 'master' && (
        <div className={`${stylesCard['card_brand']} tw-i-master-tiny`}>
          <span className="path1" />
          <span className="path2" />
          <span className="path3" />
          <span className="path4" />
        </div>
      )}
      {account.program.brand_name === 'visa' && (
        <div
          className={`${stylesCard['card_brand']} ${stylesCard['card_brand_visa']} tw-i-visa`}
        >
          <span className="path1" />
          <span className="path2" />
          <span className="path3" />
          <span className="path4" />
        </div>
      )}
      {account.program.brand_name !== 'master' &&
        account.program.brand_name !== 'visa' && (
          <div className={`${stylesCard['card_brand']} tw-i-cards`}></div>
        )}
    </div>
  </div>
);

export default Card;
