import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Reports.scss';
import moment from 'moment';
import {
  Chip,
  Tooltip,
  Typography,
  makeStyles,
  TableContainer,
  TablePagination,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '65vh',
  },
  thead: {
    background: '#214d72',
  },
});

export default function SearchTable({ trns }) {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <Paper className="container">
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead className={classes.thead}>
              <TableRow>
                <TableCell>SNo</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Event Id</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              style={{ height: window.innerHeight * 0.4, overflowY: 'scroll' }}
            >
              {trns
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((trn, i) => {
                  let city;
                  let authorization_category;
                  let status;
                  try {
                    let data = JSON.parse(trn?.data);
                    city = data?.merchant_city;
                    authorization_category = data?.authorization_category;
                    status =
                      authorization_category === 'AUTHORIZATION'
                        ? 'SUCCESS'
                        : 'FAILED';
                  } catch (error) {
                    city = null;
                  }
                  return (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {i + 1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {trn?.event_type}
                      </TableCell>

                      <TableCell> {trn?.event_id}</TableCell>
                      <TableCell>
                        <Tooltip title={authorization_category} placement="top">
                          <Chip
                            label={status}
                            style={{
                              background:
                                status === 'SUCCESS' ? 'green' : '#FE6F61',
                              color: 'white',
                              fontSize: 12,
                              fontWeight: 400,
                              paddingTop: 2,
                              width: 100,
                            }}
                            size="small"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>{city}</TableCell>
                      <TableCell>
                        {moment(trn?.timestamp).format('DD/MM/YYYY hh:mm')}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="SR_pg">
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={trns.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
    </div>
  );
}
