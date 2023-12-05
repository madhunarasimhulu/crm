import { Grid, Button, Popover, Typography } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';

import { DateRangePicker } from 'materialui-daterange-picker';
import moment from 'moment';
import ClearIcon from '@material-ui/icons/Clear';
import RenderIf from 'components/RenderIf';

export default function TimelineSearchFilter({
  setDateRange: setDateRangeProp,
  fetchEvents,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [dateRange, setDateRange] = React.useState({
    startDate: null,
    endDate: null,
  });
  const targetRef = useRef(null);
  const prevStateRef = useRef();

  const getPopoverPosition = () => {
    const targetElement = targetRef.current;
    if (targetElement) {
      const targetRect = targetElement.getBoundingClientRect();
      return {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.left + targetRect.width / 2,
      };
    }
    return {};
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    setDateRangeProp(dateRange);
    if (dateRange?.startDate === null) return;
    handleClose();
    fetchEvents({ scrollEnd: false, dateRange });
  }, [dateRange]);

  let startDate = moment(dateRange?.startDate).format('DD-MMM-YYYY');
  let endDate = moment(dateRange?.endDate).format('DD-MMM-YYYY');

  if (startDate === 'Invalid date') startDate = 'Select Date';
  if (endDate === 'Invalid date') endDate = 'Select Date';

  return (
    <div ref={targetRef}>
      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        anchorPosition={getPopoverPosition()}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <DateRangePicker
          open={open}
          toggle={handleClose}
          initialDateRange={dateRange}
          onChange={(range) => {
            setDateRange((prev) => {
              prevStateRef.current = prev;
              return range;
            });
          }}
        />
      </Popover>

      <Grid container item>
        <Grid
          container
          item
          direction="row"
          justifyContent="center"
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
            justifyContent="space-around"
            onClick={handleClick}
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
                    {startDate}
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
                onClick={handleClose}
              >
                <Grid item>
                  <Typography variant="caption" className="SR_dateTitle">
                    TO
                  </Typography>
                </Grid>
                <Grid item alignContent="center" alignItems="center">
                  <div className={'SR_datesearch'}>{endDate}</div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            sm={12}
            md={2}
            lg={2}
            direction="column"
            justifyContent="flex-end"
          >
            <Grid item xs={12} sm={12} md={2} lg={2}>
              <RenderIf render={dateRange.startDate !== null}>
                <Button
                  className="timeline_clear_btn"
                  onClick={() => {
                    setDateRange({ startDate: null, endDate: null });
                    fetchEvents({
                      scrollEnd: false,
                      dateRange: { startDate: null, endDate: null },
                    });
                  }}
                >
                  <ClearIcon className="txt-white" />
                </Button>
              </RenderIf>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
