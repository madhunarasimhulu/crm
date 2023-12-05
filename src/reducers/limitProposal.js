import appInitialState from '../store/initialState';

const { limitProposal: initialState } = appInitialState;

const limitProposalReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_CUSTOMER':
      const customer = action.data;
      const total_limit = customer?.credit_limits?.total || 0;

      return {
        ...state,
        nextLimit: total_limit,
        totalLimit: total_limit,
      };

    case 'OPEN_LIMIT_PROPOSAL':
      return {
        ...initialState,
        isOpen: true,
        totalLimit: state.totalLimit,
        nextLimit: state.totalLimit,
        nextLimitSlider: state.totalLimit,
      };

    case 'CLOSE_LIMIT_PROPOSAL':
      return {
        ...initialState,
        totalLimit: state.totalLimit,
        nextLimit: state.totalLimit,
        nextLimitSlider: state.totalLimit,
      };

    case 'SET_LIMIT_PROPOSAL_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'SET_LIMIT_PROPOSAL_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    case 'SET_LIMIT_PROPOSAL_STATUS':
      return {
        ...state,
        isLoading: false,
        status: action.data,
      };

    case 'SET_LIMIT_PROPOSAL_OUTCOME':
      return {
        ...state,
        isSubmitting: false,
        outcome: action.data,
      };

    case 'SET_LIMIT_PROPOSAL_NEXT_LIMIT':
      return {
        ...state,
        nextLimit: action.data.nextValue,
        nextLimitMasked: action.data.nextValueMasked,
      };

    case 'SET_LIMIT_PROPOSAL_NEXT_LIMIT_SLIDER':
      return {
        ...state,
        nextLimitSlider: action.data.nextValue,
      };

    case 'SET_LIMIT_PROPOSAL_REASON':
      return {
        ...state,
        selectedReason: action.data,
      };

    case 'SET_LIMIT_PROPOSAL':
      return {
        ...state,
        proposal: {
          ...state.proposal,
          ...action.data,
        },
      };

    default:
      return state;
  }
};

export default limitProposalReducer;
