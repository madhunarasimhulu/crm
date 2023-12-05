import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import OtpInputBoxes from 'components/OtpInputBoxes';

export const InternationalOtpModal = ({
  handleOtpSubmit,
  isOtpOpen,
  error,
  disabled,
  handleClose,
  btnDisabled,
}) => {
  const [otp, setOtp] = useState({
    num1: '',
    num2: '',
    num3: '',
    num4: '',
    num5: '',
    num6: '',
  });
  const handleOtpChange = (event) => {
    if (event.target.value < 10) {
      setOtp((prevFormData) => {
        event.keyCode = 9;
        return {
          ...prevFormData,
          [event.target.name]: event.target.value,
        };
      });
    }
  };

  return (
    <div>
      <Dialog open={isOtpOpen}>
        <DialogTitle>
          <div className="absolute top-0 right-1 mt1">
            <button
              type="button"
              className="button-reset bn bg-transparent pointer f4"
              onClick={() => handleClose()}
            >
              <MdClose />
            </button>
          </div>
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ marginTop: '10px' }}
          >
            <OtpInputBoxes
              id="change-pin-otp"
              label="Please enter OTP"
              otp={otp}
              handleOtpChange={handleOtpChange}
              error={error}
              disabled={disabled}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleOtpSubmit(otp);
            }}
            color="primary"
            className={
              disabled ||
              btnDisabled ||
              Object.values(otp)
                .reduce((a, b) => a + b)
                .trim().length !== 6
                ? 'International-button-secondary'
                : 'International-button'
            }
            disabled={
              disabled ||
              btnDisabled ||
              Object.values(otp)
                .reduce((a, b) => a + b)
                .trim().length !== 6
            }
          >
            submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default InternationalOtpModal;
