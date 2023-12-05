import appInitialState from '../store/initialState';

const { dispute: initialState } = appInitialState;

const disputeReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_DISPUTE_TREE_LOADING':
      return {
        ...state,
        isLoadingDisputeTree: action.data,
      };

    case 'SET_DISPUTE_TREE_DISAGREEMENT':
      return {
        ...state,
        disagreementOptions: action.data,
      };

    case 'SET_DISPUTE_TREE_SERVICE_PROBLEMS':
      return {
        ...state,
        serviceProblemsOptions: action.data,
      };

    case 'SET_DISPUTE_ANSWER':
      return {
        ...state,
        answers: state.answers.find(({ step }) => step === action.data.step)
          ? state.answers.map((answerData) =>
              action.data.step === answerData.step ? action.data : answerData,
            )
          : [...state.answers, action.data],
      };

    case 'SET_DISPUTE_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.data,
      };

    case 'RESET_DISPUTE':
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default disputeReducer;
