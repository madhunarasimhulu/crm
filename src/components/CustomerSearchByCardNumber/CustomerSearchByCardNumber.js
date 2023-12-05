/* eslint-disable jsx-a11y/alt-text */
import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash.throttle';
import { injectIntl } from 'react-intl';
import { MdSearch } from 'react-icons/md';
import { MdCreditCard } from 'react-icons/md';
import { Input } from '../commons';
import Results from './Results';
import { detectCreditCardByNumber } from '../../utils';

import {
  getCustomersByCardNumber,
  setSearchByCard,
  resetCustomersSearchByCards,
} from '../../actions';

import mastercardIcon from '../../assets/icons/mastercard.svg';
import visaIcon from '../../assets/icons/visa.svg';
import amexIcon from '../../assets/icons/amex.svg';

const cardNetworkLogos = {
  mastercard: mastercardIcon,
  visa: visaIcon,
  amex: amexIcon,
};
class CustomerSearchByCardNumber extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    searchByCard: PropTypes.shape({
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

  constructor(props) {
    super(props);
    this.fetchCustomersByCardNumber = throttle(
      this.fetchCustomersByCardNumber,
      600,
    );
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  handleChange = ({ target }) => {
    const { dispatch } = this.props;
    const { value } = target;
    dispatch(setSearchByCard(value.replace(/\s/g, '')));
  };

  /* This should be used in the future and all the logic in this method
  is a copy from the search, so none of the actions used here exist, and should be created
  to not manipulate the search store, but the searchByCard store.

  handleKeyDown = event => {
    event.stopPropagation()

    const { dispatch } = this.props
    const { keyCode } = event
    const navCodes = [9, 40, 38, 27, 13]
    const index = navCodes.indexOf(keyCode)

    if (!navCodes.includes(keyCode)) {
      return false
    }

    event.preventDefault()

    switch (index) {
      case 0:
        if (event.shiftKey) {
          return dispatch(decrementSelectedResult())
        }

        return dispatch(incrementSelectedResult())

      case 1:
        return dispatch(incrementSelectedResult())

      case 2:
        return dispatch(decrementSelectedResult())

      case 3:
        return dispatch(setSearchByCard())

      case 4:
        const { searchByCard, ui, history } = this.props

        if (!searchByCard || !searchByCard.results.length) {
          return false
        }

        const { selectedResult, results } = searchByCard
        const { customer_id, account_id, program_type: programType } = results && results[selectedResult]
        const { isMobile } = ui

        if (!customer_id || !account_id) {
          return false
        }

        const linkBasePath = `/customers/${customer_id}/accounts/${account_id}`
        let linkPath

        if (isMobile) {
          linkPath = `${linkBasePath}/summary`
        } else {
          if (programType === programTypes.CREDIT) {
            linkPath = linkBasePath // statement
          } else if (programType === programTypes.CHECKING_ACCOUNT || programType === programTypes.PRE_PAID) {
            linkPath = `${linkBasePath}/prepaid`
          } else {
            return false
          }
        }

        return history.push(linkPath)

      default:
        return false
    }
  } */

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

  formatSearch = (search) => {
    let formated = search;
    const cleanStr = search.replace(/\s/g, '');
    if (cleanStr.length > 4 && cleanStr.length < 8) {
      formated = cleanStr.replace(/^(\d{4})/, '$1 ');
    }
    if (cleanStr.length > 8 && cleanStr.length < 12) {
      formated = cleanStr.replace(/^(\d{4})(\d{4})/, '$1 $2 ');
    }
    if (cleanStr.length > 12 && cleanStr.length < 16) {
      formated = cleanStr.replace(/^(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 ');
    }
    if (cleanStr.length >= 16 && cleanStr.length < 20) {
      formated = cleanStr.replace(
        /^(\d{4})(\d{4})(\d{4})(\d{4})/,
        '$1 $2 $3 $4',
      );
    }
    if (cleanStr.length >= 20 && cleanStr.length < 24) {
      formated = cleanStr.replace(
        /^(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/,
        '$1 $2 $3 $4 $5',
      );
    }
    return formated;
  };

  fetchCustomersByCardNumber = () => {
    const { searchByCard, credentials, dispatch } = this.props;
    const { search } = searchByCard;

    dispatch(getCustomersByCardNumber(search, credentials));
  };

  resetCustomerByCardNumber = () => {
    const { dispatch } = this.props;

    dispatch(resetCustomersSearchByCards());
  };

  componentDidUpdate(prevProps) {
    const { searchByCard, credentials } = this.props;
    const { search } = searchByCard;
    const { credentials: prevCredentials } = prevProps;
    const prevSearch = prevProps.searchByCard.search;
    /**
     * # TODO:
     * Check #todo of componentDidMount
     */
    if (prevSearch !== search || credentials.token !== prevCredentials.token) {
      if (search.length >= 16) {
        this.fetchCustomersByCardNumber();
      } else {
        this.resetCustomerByCardNumber();
      }
    }
  }

  componentDidMount() {
    /**
     * # TODO:
     * Fix PismoID first render being allowed before
     * user is actually updated at host-app level
     */
    this.fetchCustomersByCardNumber();
  }

  render() {
    const { searchByCard } = this.props;
    const {
      search,
      isLoading,
      isFetching,
      results,
      displayCount,
      selectedResult,
    } = searchByCard;

    const containerClasses =
      'mt5 w-100 w-two-thirds-ns w-50-l center pa3-ns CustomerSearch';
    const disclaimerContainerClasses = 'disclaimer-card-container absolute';

    const placeholder = this.translate('customerSearch.placeholderCardNumber');

    const searchUser = this.translate('customerSearch.searchUser');
    const linkPath = '/search';

    const cardString = detectCreditCardByNumber(search);
    const cardImg =
      cardString === 'DEFAULT' ? (
        <MdCreditCard style={{ width: '36px', height: '36px' }} />
      ) : (
        <img
          src={cardNetworkLogos[cardString]}
          style={{ width: '36px', height: '36px' }}
        />
      );

    return (
      <div className={containerClasses}>
        <div className="relative">
          <div
            className="absolute ph1 pl2 ph3-ns f2 pismo-mid-gray"
            style={{ marginTop: '2px' }}
            data-testid="icon-test"
          >
            <MdSearch />
          </div>
          <Input
            name="CustomerSearchInput"
            className="f4 f3-ns indent-2 shadow-pismo-2 z-5"
            type="text"
            value={this.formatSearch(search)}
            placeholder={placeholder}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            autoFocus
            data-testid="input-test"
          />
          <div
            className="absolute right-1"
            style={{ top: '0.5rem' }}
            data-testid="card-icon-test"
          >
            {cardImg}
          </div>
        </div>

        {results.length ? (
          <div className="flex flex-column mt4">
            <div className="flex flex-row h2 bb">
              <div className="w-40 self-center b f6 pl2-ns">cliente</div>
              <div className="w-25 self-center b f6 tc">cartao pismo</div>
              <div className="w-34 self-center b f6">associado em</div>
            </div>
            <Results
              term={search}
              isLoading={isLoading}
              isFetching={isFetching}
              results={results}
              displayCount={displayCount}
              selectedResult={selectedResult}
            />
          </div>
        ) : (
          <h3 className="tc mt5" data-testid="no-result-test">
            Não há resultados para a busca
          </h3>
        )}

        <div className={disclaimerContainerClasses}>
          <Link to={linkPath}>
            <span className="pismo-link tc mb4">{searchUser}</span>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ credentials, searchByCard, ui }, props) => ({
  credentials,
  searchByCard,
  ui,
  ...props,
});

export default connect(mapStateToProps)(
  withRouter(injectIntl(CustomerSearchByCardNumber)),
);
