import { FormControlLabel, Grid, Switch, Typography } from '@material-ui/core';
import { useState } from 'react';
import SearchTable from './SearchTable';

export default function Reports({ trns, otherTrns }) {
  const [mode, setMode] = useState('trns');
  return (
    <Grid
      container
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
      direction="column"
      style={{ padding: 15 }}
    >
      <Grid
        item
        container
        xs={12}
        sm={12}
        md={12}
        lg={12}
        justifyContent="flex-start"
        direction="column"
        className="paper"
      >
        <Grid
          item
          container
          style={{
            background: '#8A8080',
            paddingLeft: 20,
            padding: 10,
            color: 'white',
          }}
          direction="row"
          justifyContent="space-between"
        >
          <Grid item>
            <Typography variant="h5">
              Live Report (
              {`${mode === 'trns' ? trns.length : otherTrns.length}`})
            </Typography>
          </Grid>
          <Grid item>
            <div className="SR_Toggle">
              <FormControlLabel
                value="Top"
                control={
                  <Switch
                    checked={mode === 'otherTrns'}
                    onChange={(e) => {
                      setMode(e.target.checked ? 'otherTrns' : 'trns');
                    }}
                  />
                }
                label={`${
                  mode === 'trns'
                    ? 'Show Other Transactions'
                    : 'Show Transactions'
                }`}
                labelPlacement="start"
              />
            </div>
          </Grid>
        </Grid>
        <Grid item style={{ padding: 20, height: '40vh' }}>
          <SearchTable trns={mode === 'trns' ? trns : otherTrns} />
        </Grid>
      </Grid>
    </Grid>
  );
}
