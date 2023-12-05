import appInitialState from '../store/initialState';

const { attendanceNotes: initialState } = appInitialState;

const attendanceNotesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'TOGGLE_ATTENDANCE_NOTES':
      return {
        ...state,
        isVisible: !state.isVisible,
      };

    case 'CLEAR_ATTENDANCE_NOTE':
      const notes = { ...state.notes };
      delete notes[action.data.protocol];

      return {
        ...state,
        isVisible: false, // sempre fica fechado ao limpar
        notes,
      };

    case 'SET_ATTENDANCE_NOTE':
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.data.protocol]: action.data.text,
        },
      };

    default:
      return state;
  }
};

export default attendanceNotesReducer;
