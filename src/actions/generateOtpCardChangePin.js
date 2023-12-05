import { PCICards } from 'clients';
import { logError } from '../utils';

const generateOtpCardChangePin = (OtpData) => (dispatch) => {
  return PCICards.generateOtpCardChangePin(OtpData)
    .then((data) => {
      return data;
    })
    .catch(logError);
};

export default generateOtpCardChangePin;
