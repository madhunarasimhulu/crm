import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import ResultItem from './ResultItem';
import { incrementDisplayCount } from '../../actions';
import { Loader } from '../commons';

import './Results.scss';

class CustomerSearchResults extends PureComponent {
  handleScroll = ({ target }) => {
    const { scrollHeight, scrollTop, offsetHeight } = target;
    const { dispatch, results, displayCount } = this.props;

    if (results && displayCount >= results) {
      return false;
    }

    if (scrollHeight - scrollTop - offsetHeight <= 200) {
      dispatch(incrementDisplayCount());
    }
  };

  componentDidUpdate(prevProps) {
    const { selectedResult: prevSelected } = prevProps;
    const { selectedResult } = this.props;

    if (prevSelected !== selectedResult) {
      const el = document.getElementsByClassName('CustomerSearchResults')[0]
        .children[selectedResult];

      if (el) {
        scrollIntoViewIfNeeded(el);
      }
    }
  }

  componentDidMount() {
    const { selectedResult } = this.props;
    const el = this.containerEl;

    if (el) {
      el.addEventListener('scroll', this.handleScroll);

      if (el.children[selectedResult]) {
        scrollIntoViewIfNeeded(el.children[selectedResult], false);
      }
    }
  }

  componentWillUnmount() {
    if (this.containerEl) {
      this.containerEl.removeEventListener('scroll', this.handleScroll);
    }
  }

  bindRefElement = (el) => {
    this.containerEl = el;
  };

  render() {
    const {
      term,
      isLoading,
      isFetching,
      results,
      displayCount,
      selectedResult,
    } = this.props;

    const containerClasses = 'bg-pismo-light-gray z-1 CustomerSearchResults';
    const emptyContainerClasses = `${containerClasses} pa3`;

    if (isFetching) {
      return (
        <div
          className={emptyContainerClasses}
          data-testid="card-results-loader-test"
        >
          <Loader size="small" />
        </div>
      );
    }

    if (term.length >= 4 && !results.length && !isLoading && !isFetching) {
      return (
        <div className={emptyContainerClasses}>Nenhum usuário encontrado</div>
      );
    }

    return (
      <div
        className={containerClasses}
        ref={this.bindRefElement}
        data-testid="card-results-test"
      >
        {results.slice(0, displayCount - 1).map((customer, index) => (
          <ResultItem
            customer={customer}
            index={index}
            selectedResult={selectedResult}
            key={`${customer.account_number}${index}${customer.last_4_digits}`}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  ...props,
});

export default connect(mapStateToProps)(CustomerSearchResults);
