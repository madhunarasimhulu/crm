import React, { useMemo, useEffect, useState, useContext } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import subDays from 'date-fns/sub_days';
import { formatDateLocale } from '../../utils';
import {
  PreRangeCarousel,
  DebitList,
  CustomerPageWrapper,
} from '../../components';

import { DebitContext } from './DebitProvider';

const DebitPaid = ({
  customer,
  credentials,
  location,
  intl,
  history,
  match: {
    params: { accountId, customerId },
  },
  org,
}) => {
  const [initialRange, setInitialRange] = useState(null);
  const [isInit, setIsInit] = useState(true);
  const {
    state: { data, isLoading, selected, currentRange },
    dispatch,
  } = useContext(DebitContext);

  useEffect(() => {
    if (isInit && credentials.email) {
      if (
        selected &&
        selected.accountId === accountId &&
        selected.customerId === customerId &&
        selected.currentRange !== null
      ) {
        history.push(`${location.pathname}?range=${selected.currentRange}`);
      } else {
        getInitialTransactions();
      }
      setIsInit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials.email]);

  useEffect(() => {
    if (!isInit && credentials.token) {
      getInitialTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const getRangeDates = () => {
    const params = new URLSearchParams(location.search);
    let range = params.get('range');
    if (range !== null) {
      setInitialRange(range);
    } else {
      setInitialRange(7);
      range = 7;
    }

    const rangeDate =
      range && range > 0
        ? {
            beginDate: formatDateLocale(
              subDays(new Date(), range),
              'DD/MM/YYYY',
              intl,
            ),
            endDate: formatDateLocale(new Date(), 'DD/MM/YYYY', intl),
          }
        : null;
    return {
      range,
      rangeDate,
    };
  };

  const getInitialTransactions = () => {
    const { range, rangeDate } = getRangeDates();
    dispatch({ type: 'SET_CURRENT_RANGE', payload: range });
    dispatch({
      type: 'GET_INITIAL_TRANSACTIONS',
      payload: {
        accountId,
        rangeDate,
        order: null,
        page: 1,
        credentials,
        org,
        dispatch,
      },
    });
  };

  const handleChange = (time) => {
    // setCurrentRange(time)
    // clearSelected()
    dispatch({ type: 'SET_CURRENT_RANGE', payload: time });
    dispatch({ type: 'CLEAR_SELECTED' });
    history.push(`${location.pathname}?range=${time}`);
  };

  const selectedItem = (item, position) => {
    dispatch({
      type: 'SELECT_ITEM',
      payload: { item, position, accountId, customerId, currentRange },
    });
    history.push(`${location.pathname}/transactions/${item.transaction.id}`);
  };

  const loadNextPage = () => {
    const rangeDate = getRangeDates();
    const dPage = data.current_page + 1;
    dispatch({
      type: 'GET_TRANSACTIONS',
      payload: {
        accountId,
        rangeDate,
        order: null,
        page: dPage,
        credentials,
        org,
        dispatch,
      },
    });
  };

  return useMemo(
    () => (
      <CustomerPageWrapper customer={customer}>
        <PreRangeCarousel range={initialRange} onChange={handleChange} />
        <DebitList
          selected={
            selected &&
            selected.customerId === customerId &&
            selected.accountId === accountId
              ? selected
              : null
          }
          data={data}
          isLoading={isLoading}
          onChange={selectedItem}
          loadNextPage={loadNextPage}
          org={org}
        />
      </CustomerPageWrapper>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customer, initialRange, data],
  );
};

const mapStateToProps = (
  { customer, credentials, attendanceNotes, org },
  props,
) => ({
  customer,
  credentials,
  attendanceNotes,
  org,
  ...props,
});

export default withRouter(connect(mapStateToProps)(DebitPaid));
