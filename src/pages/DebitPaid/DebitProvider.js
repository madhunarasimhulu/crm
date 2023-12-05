import React, { useContext, useReducer } from 'react';
import { Accounts } from '../../clients';

const initialState = {
  transactions: {},
  isLoading: false,
  reset: false,
  data: {
    items: [],
    current_page: 0,
    pages: 0,
    total_items: 0,
  },
  selected: null,
  currentRange: null,
  errorTransaction: null,
  errorTransactions: false,
};

export const DebitContext = React.createContext({ ...initialState });

const getTransactions = async (payload) => {
  const { accountId, rangeDate, order, page, credentials, dispatch } = payload;

  let response = {};
  try {
    response = await Accounts.getAccountTransactions(
      accountId,
      rangeDate,
      order,
      page,
      credentials,
    );
    dispatch({ type: 'GET_TRANSACTIONS_DONE', payload: response });
  } catch (err) {
    dispatch({ type: 'GET_TRANSACTIONS_FAIL', payload: response });
  }
};

const getTransaction = async (payload) => {
  const { accountId, transactionId, credentials, dispatch } = payload;
  let response = {};
  try {
    response = await Accounts.getAccountTransaction(
      accountId,
      transactionId,
      credentials,
    );
    dispatch({ type: 'SELECT_ITEM', payload: response });
  } catch (err) {
    dispatch({ type: 'SELECT_ITEM_FAIL', payload: response });
  }
};

const debitReducer = (state, action) => {
  switch (action.type) {
    case 'GET_INITIAL_TRANSACTIONS': {
      getTransactions({ ...action.payload });
      return {
        ...state,
        reset: true,
        isLoading: true,
      };
    }
    case 'GET_TRANSACTIONS': {
      getTransactions(action.payload);
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'GET_TRANSACTIONS_DONE':
      let updatedItems = state.data.items.concat();
      if (state.reset) {
        updatedItems = action.payload.items.concat();
      } else if (action.payload.current_page > state.data.current_page) {
        updatedItems = updatedItems.concat(action.payload.items);
      }
      return {
        ...state,
        isLoading: false,
        reset: false,
        errorTransactions: false,
        data: {
          ...action.payload,
          items: updatedItems,
        },
      };
    case 'GET_TRANSACTIONS_FAIL':
      return {
        ...state,
        errorTransactions: true,
        isLoading: false,
        reset: false,
      };
    case 'GET_TRANSACTION': {
      getTransaction(action.payload);
      return state;
    }
    case 'SELECT_ITEM':
      return {
        ...state,
        selected: { ...action.payload },
        errorTransaction: null,
      };
    case 'SELECT_ITEM_FAIL':
      return {
        ...state,
        errorTransaction: { ...action.payload },
      };
    case 'CLEAR_SELECTED':
      return {
        ...state,
        selected: null,
      };
    case 'SET_CURRENT_RANGE':
      return {
        ...state,
        currentRange: action.payload,
      };
    default:
      return state;
  }
};

const DebitProvider = ({ children }) => {
  const [state, dispatch] = useReducer(debitReducer, useContext(DebitContext));

  return (
    <DebitContext.Provider value={{ state, dispatch }}>
      {children}
    </DebitContext.Provider>
  );
};

export default DebitProvider;
