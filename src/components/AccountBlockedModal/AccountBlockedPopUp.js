import React, { useState, useEffect } from 'react';
import { BsFillExclamationTriangleFill } from 'react-icons/bs';
import { Button } from 'components/commons';
import { useDispatch, useSelector } from 'react-redux';
import { closeAccountBlockedModal } from 'actions';
import { Modal, Box, Typography, IconButton } from '@material-ui/core';
import './AccountBlockedModal.scss';
import CancelIcon from '@material-ui/icons/Cancel';

const AccountBlockedPopUp = () => {
  const { BlockedModal, customer } = useSelector((state) => state);

  return (
    <div>
      <Modal
        open={BlockedModal?.showBlockedPopUp ? true : false}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="account-blocked-modal"
      >
        <div className="account-blocked-popup">
          <IconButton
            className="account-blocked-close-icon"
            onClick={() => {
              sessionStorage.removeItem('pismo-passport-token');
              sessionStorage.removeItem('pismo-customer-id');
              sessionStorage.removeItem('pismo-document-number');
              sessionStorage.removeItem('pismo-account-id');
              window.location.href = '/';
            }}
          >
            <CancelIcon />
          </IconButton>
          <Typography variant="h4" className="account-blocked-title-lg-p">
            <center>Account Not Accessible</center>
          </Typography>
          <Typography variant="h6" component="h6" className="modalText1">
            <center>{customer?.account?.status_reason_description}</center>
          </Typography>
          <Typography variant="h6" component="h6" className="modalText2">
            <center>
              Please contact your relationship manager for further details.
            </center>
          </Typography>
        </div>
      </Modal>
    </div>
  );
};
export default AccountBlockedPopUp;
