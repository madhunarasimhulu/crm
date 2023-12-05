import { Button, Grid, Popover, Typography } from '@material-ui/core';
import React from 'react';

import './Reports.scss';

import { DateRangePicker } from 'materialui-daterange-picker';
import moment from 'moment';

export default function Search() {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const toggle = () => setOpen(!open);

  return (
    <>
      <Popover open={open} onClose={() => setOpen(false)}>
        <DateRangePicker
          open={open}
          toggle={toggle}
          initialDateRange={dateRange}
          onChange={(range) => {
            setDateRange(range);
          }}
        />
      </Popover>

      <Grid container item>
        <Grid
          container
          item
          direction="row"
          justifyContent="flex-start"
          className="SR_mainGrid"
        >
          <Grid
            container
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            direction="row"
            justifyContent="space-between"
          >
            <Grid item xs={12} sm={12} md={8} lg={8} container direction="row">
              <Grid
                item
                container
                xs={12}
                sm={12}
                md={6}
                lg={6}
                direction="column"
                justifyContent="flex-start"
                onClick={toggle}
              >
                <Grid item>
                  <Typography variant="caption" className="SR_dateTitle">
                    FROM
                  </Typography>
                </Grid>
                <Grid item alignContent="center" alignItems="center">
                  <div
                    className={['SR_datesearch', 'SR_rightborder '].join(' ')}
                  >
                    {moment(dateRange.startDate).format('DD-MMM-YYYY')}
                  </div>
                </Grid>
              </Grid>

              <Grid
                item
                container
                xs={12}
                sm={12}
                md={6}
                lg={6}
                direction="column"
                justifyContent="flex-start"
                onClick={toggle}
              >
                <Grid item>
                  <Typography variant="caption" className="SR_dateTitle">
                    TO
                  </Typography>
                </Grid>
                <Grid item alignContent="center" alignItems="center">
                  <div className={'SR_datesearch'}>
                    {moment(dateRange.endDate).format('DD-MMM-YYYY')}
                  </div>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              container
              xs={12}
              sm={12}
              md={3}
              lg={3}
              direction="column"
              justifyContent="flex-end"
            >
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <Button className={'SR_searchbtn'}>Search</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
