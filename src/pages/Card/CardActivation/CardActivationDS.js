const CardActivationDS = {
  confirmation: {
    title: 'Please Confirm before Proceeding',
    desc: 'In the following steps, you will be asked for the details of the new credit card delivered to you. Please ensure you posess the card before proceeding.',
    btn: {
      mainText: 'Yes! I have the card',
      subText: 'I don’t have the card',
    },
  },
  emailReg: {
    title: 'E-Mail Registration',
    desc: 'We will send a security code to your preferred E-Mail address to verify it.',
    btn: {
      mainText: 'Proceed',
      // subText: 'I don’t have the card',
    },
  },
  addressVerf: {
    title: 'Address Verification',
    desc: 'Please confirm if this is your current residential address:',
    btn: {
      mainText: 'CHANGE ADDRESS',
      subText: 'CONFIRM ADDRESS',
    },
  },
  newAddressVerf: {
    title: 'New Address Verification',
    desc: 'Please enter your current residential address:',
    btn: {
      mainText: 'SAVE ADDRESS',
    },
  },
  success: {
    title: 'Success!',
    addressVerfSuccessDesc:
      'Your card is in transit. It will be delivered soon to you.',
    saveAddressSuccessDesc:
      'Your address has been registered; you will receive a verification call soon to finalize this update.',
    okWithDefaultTrans: 'Your card is now ready to use',
    btn: {
      mainText: 'FINISH',
    },
  },
  cardDelivaryVerf: {
    title: 'Card Delivery Verification',
    desc: 'Enter the following details as they appear on the Credit Card delivered to you',
    btn: {
      mainText: 'CONFIRM',
    },
  },
  setPIN: {
    title: 'Set Security Code (PIN)',
    btn: {
      mainText: 'SUBMIT',
    },
  },
  customerVerf: {
    title: 'Customer Verification',
    desc: 'Enter OTP sent to your registered mobile number',
    btn: {
      mainText: 'CONFIRM',
    },
  },
  congrats: {
    title: 'Congratulations!',
    desc: 'Your {{TENANT-NAME}} has been activated successfully',
    btn: {
      mainText: 'FINISH',
    },
  },
  verfFailed: {
    title: 'Verification Failed!',
    desc: 'You have exceeded the number of OTP attempts allowed. Your account has been blocked temporarily, please contact customer support for further assistance. ',
    btn: {
      mainText: 'BACK TO HOMEPAGE',
    },
  },
  accBlocked: {
    title: 'Account Blocked!',
    desc: 'Your account has been blocked due to security reasons. Please contact customer support to unblock your account.',
    btn: {
      mainText: 'I UNDERSTAND',
    },
  },
  setTransChannels: {
    title: 'Transaction Channels:',
    btn: {
      mainText: 'No, I am okay',
      subText: 'Yes, I would like to set myself',
    },
  },
};

export default CardActivationDS;
