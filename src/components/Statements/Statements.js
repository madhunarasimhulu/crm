import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Statement } from '.';
import { PullToRefresh } from '../commons';

class Statements extends Component {
  static defaultProps = {
    statements: {
      months: [],
      selectedMonth: {
        index: null,
        statement: {},
      },
    },
  };

  static propTypes = {
    statements: PropTypes.shape({
      months: PropTypes.array.isRequired,
      selectedMonth: PropTypes.object.isRequired,
    }).isRequired,
  };

  handleRefresh = () => this.props.routeWatcher.reload();

  render() {
    const { statements } = this.props;
    const { months, isLoading, selectedMonth, currentStatement } = statements;
    const containerClasses = '';
    const month =
      months.find((m) => m.statement.id === selectedMonth.statement.id) || {};
    const {
      name,
      isCurrentyear,
      shortYear,
      due_date,
      isDue,
      isCurrent,
      isOpen,
      isUpcoming,
    } = month;

    return (
      <div className={containerClasses}>
        <div className="w-100 mw7-ns center-ns mt3-ns">
          <PullToRefresh
            settings={{ onRefresh: this.handleRefresh, zIndex: 9999 }}
          >
            <Statement
              statement={currentStatement}
              isLoading={isLoading}
              selectedMonth={selectedMonth}
              isDue={isDue}
              isUpcoming={isUpcoming}
              isOpen={isOpen}
              isCurrent={isCurrent}
              name={name}
              isCurrentYear={isCurrentyear}
              shortYear={shortYear}
              due_date={due_date}
            />
          </PullToRefresh>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ routeWatcher, ui }, props) => ({
  routeWatcher,
  ui,
  ...props,
});

export default connect(mapStateToProps)(Statements);
