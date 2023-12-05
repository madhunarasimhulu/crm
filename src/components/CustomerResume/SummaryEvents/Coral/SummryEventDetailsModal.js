import { Grid, IconButton } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';

export default function SummryEventDetailsModal({
  data,
  open = false,
  setOpen,
}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // First checking if the data is object or not
    if (!!!data || typeof data !== 'object') return;
    // now Flatrening and filtering the data
    let items = Object.entries(data);
    // Now removing the array's and objects from items
    items = items
      .filter(([x, y]) => typeof y !== 'object')
      .sort((a, b) => a[0].localeCompare(b[0]));

    setItems([...items]);
  }, [data]);

  return (
    <Dialog
      open={open}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth={true}
      onClose={() => setOpen(false)}
    >
      <DialogTitle>
        <div className="summaryEventModal_Title">
          <span className="summaryEventModal_Title_name">Details</span>
          <button
            style={{ width: 50, marginRight: -15 }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          <Grid container item direction="row" justifyContent="space-between">
            {items.map(([key, value], i) => {
              return (
                <Grid key={i} sm={6} md={6} lg={6} xl={6} item container>
                  <Grid item className="summaryEventModal_item">
                    <p className="summaryEventModal_key">
                      {String(key).replace(/_/g, ' ')}
                    </p>
                    <p className="summaryEventModal_value">{value}</p>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
