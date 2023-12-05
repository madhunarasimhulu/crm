import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import moment from 'moment';

export default function NotePannel({ note, isLastEle }) {
  const [singleItem, setSingleItem] = useState(JSON.parse(note['note']));

  return (
    <Grid
      item
      container
      className={`notes-pannel ${isLastEle ? 'last-element-border' : ''}`}
      alignItems="flex-start"
      direction="column"
    >
      <Grid item container direction="column" justifyContent="flex-start">
        <Grid item className="notes-txt-left">
          <span
            className={`notes-operator-name ${isLastEle ? 'last-element' : ''}`}
          >
            {singleItem?.createdBy?.coral_user?.name}
          </span>
        </Grid>
        <Grid item className="notes-txt-left">
          <span
            className={`notes-operator-email  ${
              isLastEle ? 'last-element' : ''
            }`}
          >
            {singleItem?.createdBy?.coral_user?.email}
          </span>
        </Grid>
        <Grid item style={{ padding: '5px' }}></Grid>
        <Grid item className="notes-txt-left">
          <p
            className={`notes-note-content ${isLastEle ? 'last-element' : ''}`}
          >
            {singleItem?.data}
          </p>
        </Grid>

        <Grid container item direction="row" justifyContent="space-between">
          <span className={`notes-time  ${isLastEle ? 'last-element' : ''}`}>
            {moment(note?.created_at).format('DD/MM/YYYY')}
          </span>
          <span className={`notes-time  ${isLastEle ? 'last-element' : ''}`}>
            {moment(note?.created_at).format('hh:mma')}
          </span>
        </Grid>
      </Grid>
    </Grid>
  );
}
