import appInitialState from '../store/initialState';
import { LocationSearch } from '../clients';
import { gatherStatementTotals } from '../utils';

const { statements: initialState } = appInitialState;
const {
  currentStatement: { transactions: statementTransactionsInitialState },
} = initialState;

const statementsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_STATEMENTS':
      const months = action.data;
      const currentMonth = action.data.find((m) => m.isCurrent);
      const preselectedMonth =
        action.data.find((m) => m.isSelected) || currentMonth;

      const selectedMonth = {
        index: preselectedMonth.index,
        statement: preselectedMonth.statement,
      };

      const selectedMonthTotals = gatherStatementTotals(preselectedMonth);

      return {
        ...state,
        months,
        selectedMonth,
        isLoading: false,
        currentStatement: {
          ...state.currentStatement,
          totals: selectedMonthTotals,
          transactions: {
            ...statementTransactionsInitialState,
          },
        },
      };

    case 'SET_STATEMENTS_LOADING':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'RESET_STATEMENTS':
      return {
        ...initialState,
      };

    case 'SET_SELECTED_MONTH':
      if (state.isScrolling) {
        return state;
      }

      const nextSelectedMonth = action.data;

      if (state.selectedMonth.statement.id === nextSelectedMonth.statement.id) {
        return state;
      }

      const nextSelectedMonthTotals = gatherStatementTotals(nextSelectedMonth);

      return {
        ...state,
        selectedMonth: {
          index: nextSelectedMonth.index,
          statement: nextSelectedMonth.statement,
        },
        currentStatement: {
          ...state.currentStatement,
          totals: nextSelectedMonthTotals,
          transactions: {
            ...statementTransactionsInitialState,
            ...state.currentStatement.transactions,
            isLoading: true,
          },
        },
      };

    case 'INCREMENT_SELECTED_MONTH':
      if (state.isScrolling) {
        return state;
      }

      const nextMonth = state.months[state.selectedMonth.index + 1];
      const nextMonthTotals = gatherStatementTotals(nextMonth);

      return {
        ...state,
        selectedMonth: {
          index: nextMonth.index,
          statement: nextMonth.statement,
        },
        currentStatement: {
          ...state.currentStatement,
          totals: nextMonthTotals,
        },
      };

    case 'DECREMENT_SELECTED_MONTH':
      if (state.isScrolling) {
        return state;
      }

      const previousMonth = state.months[state.selectedMonth.index - 1];
      const previousMonthTotals = gatherStatementTotals(previousMonth);

      return {
        ...state,
        selectedMonth: {
          index: previousMonth.index,
          statement: previousMonth.statement,
        },
        currentStatement: {
          ...state.currentStatement,
          totals: previousMonthTotals,
        },
      };

    case 'STATEMENTS_STARTED_SCROLLING':
      return {
        ...state,
        isScrolling: true,
      };

    case 'STATEMENTS_DONE_SCROLLING':
      return {
        ...state,
        isScrolling: false,
      };

    case 'SET_STATEMENT_TRANSACTIONS':
      return {
        ...state,
        currentStatement: {
          ...state.currentStatement,
          transactions: {
            ...statementTransactionsInitialState,
            ...action.data,
            isLoading: false,
          },
        },
      };

    case 'SET_SELECTED_TRANSACTION':
      return {
        ...state,
        currentStatement: {
          ...state.currentStatement,
          transactions: {
            ...statementTransactionsInitialState,
            ...state.currentStatement.transactions,
            selectedTransaction: action.data,
          },
        },
      };

    case 'SET_STATEMENT_TRANSACTIONS_LOADING':
      return {
        ...state,
        currentStatement: {
          ...state.currentStatement,
          transactions: {
            ...statementTransactionsInitialState,
            ...state.currentStatement.transactions,
            isLoading: true,
          },
        },
      };

    case 'TOGGLE_STATEMENT_VIEW':
      const { currentView } = state.currentStatement;
      const nextView = currentView === 'totals' ? 'transactions' : 'totals';

      LocationSearch.update({
        statementView: nextView === 'transactions' ? null : nextView,
      });

      return {
        ...state,
        currentStatement: {
          ...state.currentStatement,
          currentView: nextView,
          transactions: {
            ...statementTransactionsInitialState,
          },
        },
      };

    case 'SET_AGREEMENT_LOADING':
      return {
        ...state,
        agreement: {
          ...state.agreement,
          isLoading: true,
        },
      };

    case 'SET_AGREEMENT_SUMMARY':
      return {
        ...state,
        agreement: {
          ...state.agreement,
          isAgree: true,
          isLoading: false,
          summary: action.data,
        },
      };

    case 'RESET_AGREEMENT_SUMARY':
      return {
        ...state,
        agreement: {
          ...state.agreement,
          isAgree: false,
          isLoading: false,
        },
      };

    case 'SET_AGREEMENT_DUE_DATES':
      return {
        ...state,
        agreement: {
          ...state.agreement,
          isLoading: false,
          dueDates: action.data,
        },
      };

    case 'SET_AGREEMENT_CONDITIONS':
      return {
        ...state,
        agreement: {
          ...state.agreement,
          isLoading: false,
          conditions: action.data,
        },
      };

    case 'SET_AGREEMENT_CONCLUSION':
      return {
        ...state,
        agreement: {
          ...state.agreement,
          isLoading: false,
          isSendingSmsOrEmail: false,
          conclusion: action.data,
        },
      };

    case 'SET_AGREEMENT_SENDING_SMS_OR_EMAIL':
      return {
        ...state,
        agreement: {
          ...state.agreement,
          isSendingSmsOrEmail: action.data,
        },
      };

    case 'DOWNLOAD_STATEMENT_PDF':
      return {
        ...state,
        downloadStatementPdf: {
          ...state.downloadStatementPdf,
          data: action.data,
        },
      };
    case 'SET_STATEMENT_PDF_ERROR':
      return {
        ...state,
        downloadStatementPdf: {
          ...state.downloadStatementPdf,
          data: {},
        },
      };

    default:
      return state;
  }
};

export default statementsReducer;
