import appInitialState from '../store/initialState';

const { card: initialState } = appInitialState;

const interestingProps = [
  { name: 'last_4_digits', label: 'Cartão', _order: 0, isCreditProp: false },
  { name: 'card_name', label: 'Apelido', _order: 1, isCreditProp: false },
  { name: 'printed_name', label: 'Usuário', _order: 2, isCreditProp: true },
  {
    name: 'name',
    label: 'Nome',
    editable: true,
    maxLength: 20,
    _order: 3,
    isCreditProp: true,
  },
  { name: 'document_number', label: 'CPF', _order: 4, isCreditProp: false },
  {
    name: 'expiration_date',
    label: 'Expira em',
    _order: 5,
    type: 'dateMY',
    isCreditProp: false,
  },
  { name: 'network', label: 'Bandeira', _order: 6, isCreditProp: false },
  {
    name: 'issuer_card',
    label: 'Cartão Pismo',
    _order: 7,
    type: 'bool',
    isCreditProp: false,
  },
  { name: 'card_profile', label: 'Cor', _order: 8, isCreditProp: false },
  {
    name: 'creation_date',
    label: 'Associado em',
    type: 'date',
    _order: 9,
    isCreditProp: false,
  },
  {
    name: 'transaction_limit',
    label: 'Limite por transação',
    type: 'currency',
    editable: true,
    _order: 10,
    isCreditProp: true,
  },
  { name: 'type', label: 'Tipo', type: 'type', _order: 11, isCreditProp: true },
  {
    name: 'status',
    label: 'Status',
    type: 'keyword',
    _order: 12,
    isCreditProp: true,
  },
  {
    name: 'issuing_date',
    label: 'Data de emissão',
    type: 'date',
    _order: 13,
    isCreditProp: true,
  },
  {
    name: 'stage',
    label: 'Estágio',
    type: 'keyword',
    _order: 14,
    isCreditProp: true,
  },
];

const interestingPropsNames = interestingProps.map((p) => p.name);

const getParams = (card) => {
  const params = [];

  Object.keys(card)
    .filter((key) => interestingPropsNames.includes(key))
    .forEach((key) => {
      const propData = interestingProps.find((p) => p.name === key);
      const name = key;
      const value =
        key === 'last_4_digits'
          ? `**** ${card[key]}`
          : propData.type === 'bool'
          ? card[key]
          : propData.type === 'dateMY'
          ? `${card[key].substr(0, 2)}/${card[key].substr(2)}`
          : card[key] || (propData.type === 'currency' ? 0 : null);

      if (
        (key === 'transaction_limit' && card.type === 'PLASTIC') ||
        value === null ||
        value === undefined
      ) {
        return false;
      }

      if (key === 'name' && card.type === 'PLASTIC') {
        propData.editable = false;
      } else if (key === 'name' && card.type === 'VIRTUAL') {
        propData.editable = true;
      }

      params.push({
        ...propData,
        name,
        value,
      });
    });

  return params.sort((a, b) => a._order > b._order);
};

const cardReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_DELETE_CARD_MODAL':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_DELETE_CARD_MODAL':
      return {
        ...state,
        isOpen: false,
      };

    case 'SET_CARD':
      const card = action.data;
      const params = getParams(card);

      return {
        ...state,
        ...card,
        params,
        isLoading: false,
      };

    case 'SET_CARD_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'RESET_CARD':
      return {
        ...initialState,
      };

    case 'SET_BLOCK_CARD_BTN_POSITION':
      return {
        ...state,
        blockCardBtnPosition: action.data,
      };

    case 'SET_CARD_STAGE':
      return {
        ...state,
        stage: action.data,
      };

    case 'SET_CARD_STATUS':
      return {
        ...state,
        status: action.data,
      };

    case 'SET_PCI_CARD_INFO_LOADING':
      return {
        ...state,
        isLoadingPCI: action.data,
      };

    case 'SET_PCI_CARD_INFO':
      const pciInfo = action.data;

      return {
        ...state,
        ...pciInfo,
        isLoadingPCI: false,
      };

    case 'SET_PCI_CARD_ERROR':
      return {
        ...state,
        isLoadingPCI: false,
      };

    case 'UPDATE_CARD':
      return {
        ...state,
        ...action.data,
      };

    default:
      return state;
  }
};

export default cardReducer;
