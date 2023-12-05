import {
  Grid,
  Typography,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  MenuItem,
  InputBase,
  Select,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getServiceHistory, showToast } from 'actions';
import { Loader } from 'components/commons';

export default function ServiceHistory() {
  const dispatch = useDispatch();
  const { serviceRequestsHistory, isLoading, errorMsg } = useSelector(
    (state) => state.serviceRequest,
  );
  const { accountId, customerId } = useSelector((state) => state.customer);
  const sortByList = ['status', 'source'];
  const [sortBy, setSortBy] = useState(sortByList[0]);
  const [tableData, setTableData] = useState([]);
  const [searchServiceRequest, setSearchServiceRequest] = useState('');
  var currentDate = new Date();
  var firstDay = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [fromDateRange, setFromDateRange] = useState(
    firstDay.toISOString().split('T')[0],
  );
  const [toDateRange, setToDateRange] = useState(
    currentDate.toISOString().split('T')[0],
  );

  function sortByProperty(list, property) {
    var tempList = list;
    return tempList.sort((a, b) => {
      const nameA = a[property].toString().toUpperCase(); // ignore upper and lowercase
      const nameB = b[property].toString().toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  const filterViaServiceRequest = async () => {
    var temp = sortByProperty(
      serviceRequestsHistory
        ?.map(createData)
        .filter((item) => item?.ticketId.search(searchServiceRequest) !== -1),
      sortBy,
    );
    setTableData(temp);
  };

  useEffect(() => {
    if (searchServiceRequest) {
      filterViaServiceRequest();
    } else {
      let sotedVal = sortByProperty(
        serviceRequestsHistory?.map(createData),
        sortBy,
      );
      setTableData(sotedVal);
    }
  }, [serviceRequestsHistory]);

  useEffect(() => {
    if (searchServiceRequest) {
      filterViaServiceRequest();
    }
  }, [searchServiceRequest]);

  useEffect(() => {
    if (tableData) {
      var sortedData = sortByProperty(tableData, sortBy);
      setTableData(sortedData);
    }
  }, [sortBy]);

  const handleTableSorting = (ev) => {
    setSortBy(ev.target.value);
  };
  const handleSearchServiceRequestChange = (ev) => {
    setSearchServiceRequest(ev.target.value);
  };
  const handleFromDateRange = (ev) => {
    setFromDateRange(ev.target.value);
  };
  const handleToDateRange = (ev) => {
    setToDateRange(ev.target.value);
  };
  const handleDateChange = () => {
    if (fromDateRange && toDateRange) {
      dispatch(
        getServiceHistory({
          accountId,
          customerId,
          startDate: fromDateRange,
          endDate: toDateRange,
        }),
      );
    } else {
      dispatch(
        showToast({
          message: 'please select start date and end date',
          style: 'error',
        }),
      );
    }
  };

  function createData(serviceRequestsItem) {
    return {
      date: serviceRequestsItem?.timestamp.substr(0, 10),
      ticketId: serviceRequestsItem?.ticketId,
      source: serviceRequestsItem?.requestorDetail?.sourceSystem,
      serviceType: serviceRequestsItem?.requestType,
      status: serviceRequestsItem?.status,
    };
  }

  return (
    <div className="serviceHistory">
      <div className="filters">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3} lg={3}>
            <Typography className="serviceHistoryTitle">Sort By</Typography>
            <Select
              onChange={handleTableSorting}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className="serviceHistoryField selectWidth"
              name="SortBy"
              value={sortBy}
            >
              {sortByList.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <Typography className="serviceHistoryTitle">Request No.</Typography>
            <InputBase
              fontSize="16px"
              onChange={handleSearchServiceRequestChange}
              value={searchServiceRequest}
              className="filterServiceRequest serviceHistoryField serviceHistoryBody"
              type="number"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Typography className="serviceHistoryTitle">Date Range</Typography>
            <div className="serviceHistoryDateGroup">
              <div className="dateGroup">
                <div className="serviceHistoryDate">
                  <input
                    type="date"
                    name="fromDateRange"
                    value={fromDateRange}
                    onChange={handleFromDateRange}
                    max={toDateRange}
                    className="serviceHistoryBody"
                  />
                </div>
                <div className="serviceHistoryDateBreak">{''}</div>
                <div className="serviceHistoryDate">
                  <input
                    type="date"
                    name="toDateRange"
                    value={toDateRange}
                    onChange={handleToDateRange}
                    id="datefield"
                    min={fromDateRange}
                    max={currentDate.toISOString().split('T')[0]}
                    className="serviceHistoryBody"
                  />
                </div>
              </div>
              <button
                onClick={handleDateChange}
                className="dateChange"
                type="button"
              >
                Go
              </button>
            </div>
          </Grid>
        </Grid>
      </div>
      {isLoading ? (
        <center>
          <br />
          <br />
          <Loader />
        </center>
      ) : tableData.length === 0 ? (
        <center>
          <br />
          <br />
          <p>No data found</p>
        </center>
      ) : (
        <TableContainer sx={{ minHeight: '65vh' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Request Number</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData?.map((row) => (
                <TableRow
                  key={row?.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    {new Date(row?.date)
                      .toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                      .replace(/ /g, '-')}
                  </TableCell>
                  <TableCell>{row.ticketId}</TableCell>
                  <TableCell>{row.source}</TableCell>
                  <TableCell>{row.serviceType}</TableCell>
                  <TableCell>
                    {row?.status
                      .toLowerCase()
                      .split(' ')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
