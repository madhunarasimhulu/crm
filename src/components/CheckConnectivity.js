import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

export default function CheckConnectivity({ children }) {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleStatusChange = () => {
      setOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [online]);

  return (
    <div>
      <Dialog open={!online}>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ marginTop: '10px' }}
          >
            {!online && (
              <div>
                <h4>Ooops....!</h4>
                <h5>No Internet Connectivity</h5>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {online && children}
    </div>
  );
}
