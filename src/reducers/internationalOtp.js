import appInitialState from '../store/initialState';

const { internationalOtp: initialState } = appInitialState;

const internationalOtpReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN_INTERNATIONAL_OTP':
      return {
        ...state,
        isInternationalOtpOpen: true,
      };
    case 'CLOSE_INTERNATIONAL_OTP':
      return {
        ...state,
        isInternationalOtpOpen: false,
      };
    case 'SET_OTP_INTERNATIONAL_DATA':
      return {
        ...state,
        otpdata: action.data,
      };
    case 'CLEAR_OTP_INTERNATIONAL_DATA':
      return {
        ...state,
        otpdata: {},
      };

    default:
      return state;
  }
};

export default internationalOtpReducer;
