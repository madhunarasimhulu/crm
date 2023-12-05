import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Grid, IconButton, InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useEffect, useState } from 'react';
import SearchDropBox from './SearchDropBox/SearchDropBox';
import { ShimmerTable } from 'react-shimmer-effects';
import { setCustomerSearchResult, showToast } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { CoralAPI } from 'clients/coral';
import { Loader } from 'components/commons';
import { useHistory } from 'react-router-dom';

const initialValues = {
  type: 'document_number',
  search: '',
};

const searchOptions = [
  { key: 'document_number', value: 'Document Number/ Email/ Name' },
  { key: 'phonenumber', value: 'Phone Number' },
];

export default function Search() {
  const [fields, setFields] = useState({ ...initialValues });
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state?.customerSearch?.result);
  const dispatch = useDispatch();
  const history = useHistory();

  const setData = (data) => {
    dispatch(setCustomerSearchResult(data));
  };

  useEffect(() => {
    if (data.length > 0) return;
    setFields({ ...fields });
  }, [data]);

  const handleSearch = () => {
    if (!validateSearch()) return;
    search();
  };

  const validateSearch = () => {
    if (!fields.search && fields.search == '') {
      //Getting Error Name
      let errorName = searchOptions.find((x) => x.key === fields.type);
      if (!errorName) return false;
      dispatch(
        showToast({
          message: `Please enter ${errorName.value} to proceed`,
          style: 'error',
        }),
      );
      return false;
    }

    //Validating Email Manually
    if (fields.type === 'email') {
      let emailRegX =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegX.test(fields.search)) {
        dispatch(
          showToast({
            message: `Please enter a valid Email`,
            style: 'error',
          }),
        );
        return false;
      }
    }

    //Validating Mobile Manually
    if (fields.type === 'phonenumber') {
      let mobileRegx = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
      if (!mobileRegx.test(fields.search)) {
        dispatch(
          showToast({
            message: `Please enter a valid Mobile Number`,
            style: 'error',
          }),
        );
        return false;
      }
    }
    return true;
  };

  const handleChange = (e) => {
    fields[e.target.name] = e.target.value;
    setFields({ ...fields });
    //This is to update the search params everytime when user Changed the Type & value
    if (fields.search === '') history.push('?');
    else
      history.push(
        `?&search_type=${fields.type}&search_value=${fields.search}`,
      );
  };

  useEffect(() => {
    //Getting Search Params & Prepopulating if there is Any Search values is there by default & Making Automated Search
    let params = new URLSearchParams(window.location.hash);
    let type = params.get('search_type');
    let value = params.get('search_value');
    //validating Params if we are getting Correct Details form URL
    if (!validateURLParams(type, value)) return;
    //Setting the values to state
    fields['type'] = type;
    fields['search'] = value;
    setFields({ ...fields });
    //Now Calling the search Function to automate the search Results
    search();
  }, []);

  const validateURLParams = (type, value) => {
    //Validating Both Value & Type are available
    let validateParams = Boolean(type) && Boolean(value);
    if (!validateParams) return validateParams;
    //Now Checking the search_type param is available in our allowed list
    let find = Boolean(
      searchOptions.find(
        (x) => x.key.toLowerCase() === String(type).toLowerCase(),
      ),
    );
    if (!find) return find;
    return true;
  };

  //This is to update the search params everytime when user Changed the Type & value
  // useEffect(() => {}, [fields]);

  const noSearchResults = () =>
    dispatch(showToast({ message: 'No search results found', style: 'error' }));

  const search = async () => {
    //Rejecting if there is no Client ID
    let clientId = localStorage.getItem('clientId');
    if (!clientId)
      return dispatch(
        showToast({
          message: 'Select Tenant to proceed',
          style: 'error',
        }),
      );
    //Preparing Params Data
    let data = {
      search_type: String(fields.type).trim(),
      search_value: String(fields.search).trim(),
    };
    //Making API Call to fetch Data
    setLoading(true);
    await CoralAPI({
      url: '/search/users',
      params: data,
    })
      .then(({ data }) => {
        if (!data || !Array.isArray(data)) {
          dispatch(
            showToast({
              message: 'Something went wrong please try after sometime',
              style: 'error',
            }),
          );
        }
        if (data.length === 0) noSearchResults();
        setData(data);
        setLoading(false);
      })
      .catch((e, res) => {
        setLoading(false);
        setData([]);
        if (e?.message) noSearchResults();
      });
    //Making API Call to fetch Data
  };

  const handleEnter = (e) => {
    if (e?.key === 'Enter') handleSearch();
  };

  return (
    <Grid
      container
      item
      sm={12}
      md={12}
      lg={12}
      justifyContent="center"
      direction="row"
    >
      <Grid
        container
        item
        sm={10}
        md={8}
        lg={6}
        xs={11}
        justifyContent="flex-start"
      >
        <Grid item sm={12} md={12} lg={12} xs={12}>
          {/* Search Fields */}
          <div
            style={{
              borderRadius: 25,
              height: 50,
              display: 'flex',
              background: '#e4e4e4',
              justifyContent: 'space-between',
            }}
          >
            <div className="CustSearch_search_key">
              <Select
                style={{ marginTop: 10, marginLeft: 15, color: '#919191' }}
                fullWidth={true}
                value={fields.type}
                variant="standard"
                name="type"
                className="nofocus"
                disableUnderline
                onChange={handleChange}
              >
                {searchOptions.map(({ key, value }, i) => {
                  return (
                    <MenuItem key={i} value={key}>
                      {value}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <div className="CustSearch_search_value">
              <TextField
                fullWidth={true}
                size="medium"
                type="search"
                style={{ marginTop: 3, marginLeft: 10 }}
                variant="standard"
                name="search"
                value={fields.search}
                onKeyDown={handleEnter}
                onChange={handleChange}
                InputProps={{
                  style: {
                    '::placeholder': {
                      fontWeight: 400,
                      opacity: 0.25,
                      fontSize: 40,
                      lineHeight: '30.26px',
                    },
                  },
                  disableUnderline: true,
                  placeholder: 'Search...',
                  endAdornment: (
                    <InputAdornment position="end">
                      {loading ? (
                        <div style={{ background: 'green', marginRight: 25 }}>
                          <Loader />
                        </div>
                      ) : (
                        <IconButton
                          onClick={handleSearch}
                          disableRipple={true}
                          disableFocusRipple={true}
                          disableTouchRipple={true}
                          className="searchIconButton"
                        >
                          <SearchIcon
                            style={{
                              color: '#FE6F61',
                              fontSize: 30,
                              fontWeight: '600',
                            }}
                          />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          {/* Search Fields */}
        </Grid>
        <Grid
          sm={12}
          md={12}
          lg={12}
          container
          justifyContent="center"
          direction="row"
          // style={{ background: 'blue' }}
        >
          {/* Search Results Box */}
          {loading && (
            <Grid sm={11} md={11} lg={11} xs={11}>
              <ShimmerTable row={2} col={2} style={{ width: '100%' }} />
            </Grid>
          )}
          <Grid item sm={11} md={11} lg={11} xs={11}>
            {!loading && data.length > 0 && <SearchDropBox data={data} />}
          </Grid>
          {/* Search Results Box */}
        </Grid>
      </Grid>
    </Grid>
  );
}
