import appInitialState from '../store/initialState';

const { cards: initialState } = appInitialState;

const cardsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CARDS_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };
    case 'SET_ISWALLETLOADINGCOMPETED_LOADING':
      return {
        ...state,
        isWalletloadingCompleted: action.data,
      };
    case 'SET_CARDS':
      return {
        ...state,
        list: action?.data?.list || [],
        groups: [...state.groups, ...action?.data?.groups],
        cardErrorMsg: '',
        isLoading: false,
      };
    case 'SET_CARDS_FAILURE':
      return {
        ...state,
        list: [],
        groups: [...state.groups],
        cardErrorMsg: action.data,
        isLoading: false,
      };

    case 'RESET_CARDS':
      return {
        ...initialState,
      };

    case 'SET_ADD_NEW_CARD_BTN_POSITION':
      return {
        ...state,
        addNewCardBtnPosition: action.data,
      };

    default:
      return state;
  }
};

export default cardsReducer;
