import React, { useEffect, useRef } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Loader } from '../commons';
import './DebitList.scss';
import { FormatMoney } from '..';

const DebitList = ({
  data,
  onChange,
  selected: itemSelected,
  isLoading,
  loadNextPage,
  org,
}) => {
  const containerRef = useRef();
  const { items, current_page, pages } = data;

  useEffect(() => {
    if (containerRef.current && itemSelected && itemSelected.position) {
      containerRef.current.scroll(0, itemSelected.position);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current, itemSelected]);

  const selected = (item, position) => {
    if (onChange) {
      onChange(item, position);
    }
  };
  const hasNextPage = current_page < pages;
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = isLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index) => !hasNextPage || index < items.length - 1;

  const itemRenderer = ({ style, index }) => {
    if (!isItemLoaded(index)) {
      return (
        <div style={style}>
          <Loader />
        </div>
      );
    }
    return (
      <DebitCard
        style={style}
        key={`${items[index].transaction.id}-${index}`}
        item={items[index]}
        onClick={selected}
        isSelected={
          itemSelected &&
          itemSelected.item.transaction.id === items[index].transaction.id
        }
        org={org}
      />
    );
  };

  return (
    <div className="transactions-base">
      {items.length > 0 ? (
        <AutoSizer>
          {({ width, height }) => (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
                <FixedSizeList
                  width={width}
                  height={height}
                  itemCount={itemCount}
                  itemSize={50}
                  ref={ref}
                  onItemsRendered={onItemsRendered}
                >
                  {itemRenderer}
                </FixedSizeList>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      ) : (
        <div className="transaction-notfound">
          <FormattedMessage id="noTransactionsFound" />
        </div>
      )}
    </div>
  );
};

const DebitCard = ({
  item,
  item: {
    authorization: {
      event_date_utc,
      type_code,
      type,
      amount,
      is_credit,
      soft_descriptor,
    },
  },
  onClick,
  isSelected,
  style,
  org,
}) => {
  const dom = useRef();
  const clicked = () => {
    if (onClick) {
      onClick(item, dom.current.parentElement.scrollTop);
    }
  };

  const arrCodeCancel = [
    212, 213, 214, 215, 311, 312, 502, 503, 504, 505, 506, 507, 508, 509, 510,
    511, 512, 514, 606, 617, 705, 902, 910, 918, 919,
  ];

  const isCancel = arrCodeCancel.includes(type_code);

  const softDescriptor = type === 'COMPRA A VISTA' && soft_descriptor;

  return (
    <div
      ref={dom}
      style={style}
      onClick={clicked}
      className={`transaction-item ${isCancel && 'transaction-cancel'} ${
        isSelected && 'transaction-selected'
      }`}
    >
      <div className="transaction-date">
        <FormattedDate value={event_date_utc} day="2-digit" month="short" />
      </div>
      <div className="transaction-description">
        <FormattedMessage
          id={softDescriptor || `transactions.debit.${soft_descriptor}`}
          defaultMessage={soft_descriptor || type}
        />
      </div>
      <div className={`transaction-value ${!is_credit && 'transaction-debit'}`}>
        {item?.currencyCode || org.currency}
        <strong style={{ marginLeft: '3px' }}>
          <FormatMoney value={!is_credit ? amount * -1 : amount} />
        </strong>
      </div>
    </div>
  );
};

export default DebitList;
