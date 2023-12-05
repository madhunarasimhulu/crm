import appInitialState from '../store/initialState';

const { call: initialState } = appInitialState;

const protocolReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CUSTOMER_PROTOCOL':
      return {
        ...state,
        currentProtocol: action.data.protocol,
        onCall: true,
        init: new Date().getTime(),
        respectiveCustomer: {
          customerId: action.data.customerId,
          accountId: action.data.accountId,
        },
      };

    case 'CLOSE_CUSTOMER_PROTOCOL':
      return {
        ...state,
        currentProtocol: null,
        onCall: false,
        init: null,
        timerCount: null,
      };

    case 'UPDATE_PROTOCOL_TIMER_COUNTER':
      return {
        ...state,
        timerCount: action.payload,
      };

    default:
      return state;
  }
};

export default protocolReducer;
