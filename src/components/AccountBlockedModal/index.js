import React, { useState, useEffect } from 'react';
import { BsFillExclamationTriangleFill } from 'react-icons/bs';
import { Button } from 'components/commons';
import { useDispatch, useSelector } from 'react-redux';
import { closeAccountBlockedModal } from 'actions';
import { Modal, Box, Typography, IconButton } from '@material-ui/core';
import './AccountBlockedModal.scss';

const AccountBlockedModal = () => {
  const dispatch = useDispatch();
  const isAccountBlockedModalOpen = useSelector(
    (state) => state?.isAccountBlockedModalOpen,
  );

  const handleModalClose = () => {
    dispatch(closeAccountBlockedModal());
  };
  return (
    <div>
      <Modal
        open={isAccountBlockedModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="account-blocked-modal"
      >
        <div className="account-blocked-container">
          <Typography variant="h4" className="account-blocked-title-lg">
            <center>Account Blocked!</center>
          </Typography>
          <Typography variant="h6" component="h6" className="modalText">
            <center>
              Your account has been blocked due to security reasons. Please
              contact customer support to unblock your account.
            </center>
          </Typography>
          <center>
            <BsFillExclamationTriangleFill
              style={{ color: 'red', fontSize: '65px' }}
            />
          </center>
          <Button
            text="I UNDERSTAND"
            type="button"
            onClick={handleModalClose}
          />
        </div>
      </Modal>
    </div>
  );
};
export default AccountBlockedModal;
