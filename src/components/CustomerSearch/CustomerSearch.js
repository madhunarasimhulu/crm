import React, { Component, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Results from './Results';
import { itiTenants } from '../../constants';
import { Input } from '../commons';

import {
  getCustomers,
  getCustomersV2,
  setCustomerSearch,
  incrementSelectedResult,
  decrementSelectedResult,
} from '../../actions';
import { isCardsOnFileOperator, isCreditProgramType } from '../../utils';

class CustomerSearch extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    customers: PropTypes.shape({
      search: PropTypes.string.isRequired,
      results: PropTypes.any,
      displayCount: PropTypes.number.isRequired,
      selectedResult: PropTypes.number.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    displayCount: 25,
    selectedResult: 0,
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  handleChange = ({ target }) => {
    const { dispatch } = this.props;
    const { value } = target;

    dispatch(setCustomerSearch(value));
  };

  handleKeyDown = (event) => {
    event.stopPropagation();

    const { dispatch } = this.props;
    const { keyCode } = event;
    const navCodes = [9, 40, 38, 27, 13];
    const index = navCodes.indexOf(keyCode);

    if (!navCodes.includes(keyCode)) {
      return false;
    }

    event.preventDefault();

    switch (index) {
      case 0:
        if (event.shiftKey) {
          return dispatch(decrementSelectedResult());
        }

        return dispatch(incrementSelectedResult());

      case 1:
        return dispatch(incrementSelectedResult());

      case 2:
        return dispatch(decrementSelectedResult());

      case 3:
        return dispatch(setCustomerSearch());

      case 4:
        const { customers, ui, history } = this.props;

        if (!customers || !customers.results.length) {
          return false;
        }

        const { selectedResult, results } = customers;
        const {
          customer_id,
          account_id,
          program_type: programType,
        } = results && results[selectedResult];
        const { isMobile } = ui;

        if (!customer_id || !account_id) {
          return false;
        }

        const linkBasePath = `/customers/${customer_id}/accounts/${account_id}`;
        let linkPath;

        if (isMobile) {
          linkPath = `${linkBasePath}/summary`;
        } else if (isCreditProgramType(programType)) {
          linkPath = linkBasePath; // statement
        } else {
          linkPath = `${linkBasePath}/debit`;
        }

        return history.push(linkPath);

      default:
        return false;
    }
  };

  /**
   * Gambiarra to move cursor to the end of input
   * that is rendered with an initial value
   */
  handleFocus = (event) => {
    const { target } = event;
    const { value: initialValue } = target;

    target.value = '';
    target.value = initialValue;
  };

  fetchCustomers = () => {
    const { user, customers, credentials, dispatch } = this.props;
    const { search } = customers;
    const { tenant } = user;

    if (itiTenants.includes(tenant)) {
      dispatch(getCustomersV2(search, credentials));
    } else {
      dispatch(getCustomers(search, credentials));
    }
  };

  render() {
    const { user, customers } = this.props;
    const { tenant } = user;
    const {
      search,
      isLoading,
      isFetching,
      results,
      displayCount,
      selectedResult,
    } = customers;

    const containerClasses =
      'mt5 w-100 w-two-thirds-ns w-50-l center pa3-ns CustomerSearch';
    const disclaimerContainerClasses = 'disclaimer-container absolute';

    const tip = this.translate('customerSearch.tip');
    const tipV2 = this.translate('customerSearch.tipV2');
    const placeholder = itiTenants.includes(tenant) ? tipV2 : tip;

    const enabledLinkSearchByCardNumber = isCardsOnFileOperator(user.roles);
    const searchByCardNumber = this.translate(
      'customerSearch.searchByCardNumber',
    );
    const linkPath = '/search-by-card-number';

    return (
      <div className={containerClasses}>
        <div className={disclaimerContainerClasses}>
          {enabledLinkSearchByCardNumber && (
            <Link to={linkPath}>
              <span className="pismo-link tc">{searchByCardNumber}</span>
            </Link>
          )}
        </div>
        <Box display="flex">
          <Input
            name="CustomerSearchInput"
            className="f4 f3-ns shadow-pismo-2 z-5"
            type="text"
            value={search}
            placeholder={placeholder}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
            autoComplete={false}
            autoFocus
            data-testid="input-test"
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          />
          <SearchButton onClick={this.fetchCustomers} />
        </Box>
        <Results
          term={search}
          isLoading={isLoading}
          isFetching={isFetching}
          results={results}
          displayCount={displayCount}
          selectedResult={selectedResult}
        />
      </div>
    );
  }
}

const useStyles = makeStyles(() => ({
  bt: {
    borderBottomLeftRadius: '0px',
    borderTopLeftRadius: '0px',
    maxHeight: '51px',
    textTransform: 'unset',
  },
}));

const SearchButton = ({ onClick }) => {
  const classes = useStyles();
  useEffect(() => {
    window.addEventListener('keyup', keyUpHandler);

    return () => window.removeEventListener('keyup', keyUpHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyUpHandler = (e) => {
    if (e.key.match(/enter/gi)) {
      onClick();
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.bt}
      onClick={onClick}
    >
      <SearchIcon className={classes.icon} />
    </Button>
  );
};

const mapStateToProps = ({ user, credentials, customers, ui }, props) => ({
  user,
  credentials,
  customers,
  ui,
  ...props,
});

export default connect(mapStateToProps)(withRouter(injectIntl(CustomerSearch)));
