import { connect } from 'react-redux';
import { Header, Transactions, Totals } from '.';
import { Loader } from '../../commons';
import { getStatementTransactions } from '../../../actions';
import { SimplePaginator } from '../..';

import './Statement.module.scss';

const Statement = ({
  fullDueDate,
  statement,
  isLoading,
  isDue,
  isCurrent,
  selectedMonth,
  isOpen,
  isUpcoming,
  name,
  isCurrentyear,
  shortYear,
  due_date,
  statements,
  customer,
  credentials,
  dispatch,
}) => {
  if (isLoading) {
    return (
      <div className="tc">
        <Loader />
      </div>
    );
  }

  const { currentPage, totalPages, has_next } = statement.transactions;
  const { accountId } = customer;

  function handlePreviousPage() {
    if (currentPage === 0) {
      return;
    }

    dispatch(
      getStatementTransactions(
        accountId,
        statements,
        credentials,
        currentPage - 1,
      ),
    );
  }

  function handleNextPage() {
    if (!has_next) {
      return;
    }

    dispatch(
      getStatementTransactions(
        accountId,
        statements,
        credentials,
        currentPage + 1,
      ),
    );
  }

  return (
    <div>
      <Header
        {...statement}
        fullDueDate={fullDueDate}
        isLoading={isLoading}
        selectedMonth={selectedMonth}
        isDue={isDue}
        isOpen={isOpen}
        isUpcoming={isUpcoming}
        isCurrent={isCurrent}
        name={name}
        isCurrentYear={isCurrentyear}
        shortYear={shortYear}
        due_date={due_date}
        statements={statements}
        statement={statement}
      />

      {statement.currentView === 'totals' ? (
        <Totals totals={statement.totals} />
      ) : (
        <>
          <Transactions
            {...statement.transactions}
            statementId={selectedMonth.statement.id}
            selectedTransaction={statement.transactions.selectedTransaction}
          />

          {totalPages > 0 ? (
            <SimplePaginator
              currentPage={currentPage + 1}
              totalPages={totalPages}
              onPreviousClick={() => handlePreviousPage()}
              onNextClick={() => handleNextPage()}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({ statements, customer, credentials }, props) => ({
  statements,
  customer,
  credentials,
  ...props,
});

export default connect(mapStateToProps)(Statement);
