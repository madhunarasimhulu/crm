import React, { useContext, useEffect, Fragment } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  PreRangeCarousel,
  CustomerPageWrapper,
  FormatMoney,
} from '../../components';

import { DebitContext } from './DebitProvider';

const useStyle = makeStyles(() => ({
  paper: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    backgroundColor: '#ECEEF2',
  },
  date: {
    fontWeight: 'bold',
  },
  amount: {
    fontWeight: 'bold',
  },
  negative: {
    color: '#d40f2c',
  },
  positive: {
    color: '#26c33b',
  },
  cancel: {
    textDecoration: 'line-through',
  },
  message: {
    color: '#000000',
  },
}));

const DebitTransaction = ({
  customer,
  match: {
    params: { accountId, customerId, transactionId },
  },
  credentials,
  history,
  org,
}) => {
  const classes = useStyle();
  const {
    state: { selected },
    dispatch,
  } = useContext(DebitContext);

  useEffect(() => {
    if (!selected) {
      history.push(
        `/customers/${customerId}/accounts/${accountId}/debit?range=${0}`,
      );
    }
  });

  const closeDetail = () => {
    history.push(`/customers/${customerId}/accounts/${accountId}/debit`);
  };

  const handleChange = (time) => {
    dispatch({ type: 'CLEAR_SELECTED' });
    history.push(
      `/customers/${customerId}/accounts/${accountId}/debit?range=${time}`,
    );
  };

  const arrCodeCancel = [
    212, 213, 214, 215, 311, 312, 502, 503, 504, 505, 506, 507, 508, 509, 510,
    511, 512, 514, 606, 617, 705, 902, 910, 918, 919,
  ];

  if (
    selected &&
    selected.item &&
    selected.item.authorization.soft_descriptor.indexOf(
      selected.item.authorization.type,
    ) !== -1
  ) {
  }

  const cssCancel =
    selected && selected.item
      ? arrCodeCancel.includes(selected.item.authorization.type_code)
        ? classes.cancel
        : ''
      : '';
  const cssCredit =
    selected && selected.item
      ? selected.item.authorization.is_credit
        ? classes.positive
        : classes.negative
      : '';

  const softDescriptor =
    selected.item.authorization.type === 'COMPRA A VISTA' &&
    selected.item.authorization.soft_descriptor;

  const amount = selected.item.authorization.amount;

  return (
    <CustomerPageWrapper customer={customer}>
      <PreRangeCarousel
        range={
          selected && selected.currentRange !== null ? selected.currentRange : 0
        }
        onChange={handleChange}
      />
      <Box display="flex" justifyContent="center" width={1} pt="20px">
        <Paper className={classes.paper}>
          {selected && selected.item ? (
            <>
              <Box width={1} display="flex" justifyContent="flex-end">
                <IconButton onClick={closeDetail}>
                  <Close />
                </IconButton>
              </Box>
              <Box width={1} display="flex" justifyContent="center" mt="-30px">
                <Typography variant="body2" className={classes.date}>
                  <FormattedDate
                    value={selected.item.authorization.event_date_utc}
                    month="short"
                    day="2-digit"
                    year="numeric"
                  />{' '}
                  -{' '}
                  <FormattedTime
                    value={selected.item.authorization.event_date_utc}
                  />
                </Typography>
              </Box>
              <Box width={1} display="flex" justifyContent="center" mt="30px">
                <Typography variant="body1">
                  {selected.item.merchant.name
                    ? selected.item.merchant.name.toUpperCase()
                    : ''}
                </Typography>
              </Box>
              <Box
                width={1}
                display="flex"
                alignItems="baseline"
                justifyContent="center"
                mt="40px"
              >
                <Typography variant="h5" className={`${cssCredit}`}>
                  {selected.item.currencyCode || org.currency}
                </Typography>
                <Typography
                  variant="h5"
                  className={`${cssCredit} ${cssCancel} ${classes.amount}`}
                >
                  <FormatMoney
                    value={
                      !selected.item.authorization.is_credit
                        ? amount * -1
                        : amount
                    }
                  />
                </Typography>
              </Box>
              <Box
                width={1}
                display="flex"
                justifyContent="center"
                mb="40px"
                mt="20px"
              >
                <Typography
                  variant="subtitle1"
                  className={`message ${classes.amount}`}
                  align="center"
                >
                  <FormattedMessage
                    id={
                      softDescriptor ||
                      `transactions.debit.${selected.item.authorization.soft_descriptor}`
                    }
                    defaultMessage={
                      selected.item.authorization.soft_descriptor ||
                      selected.item.authorization.type
                    }
                  />
                  <br />
                  <br />
                </Typography>
              </Box>
              <Box width={1} display="flex" justifyContent="center">
                <Typography variant="body1">{`${
                  selected.item.merchant.city || ''
                }${
                  selected.item.merchant.city && selected.item.merchant.state
                    ? ','
                    : ''
                }${selected.item.merchant.state || ''}`}</Typography>
              </Box>
            </>
          ) : null}
        </Paper>
      </Box>
    </CustomerPageWrapper>
  );
};

const mapStateToProps = (
  { customer, credentials, attendanceNotes, user, org },
  props,
) => ({
  customer,
  credentials,
  attendanceNotes,
  user,
  org,
  ...props,
});

export default withRouter(connect(mapStateToProps)(DebitTransaction));
