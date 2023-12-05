import { Component } from 'react';
import './Timeline.scss';
import CategorySelector from './CategorySelector';
import TimelineSearchFilter from './TimelineSearchFilter';
import TimeLineResult from './TimeLineResult';
import TimelineClient from 'clients/Timeline';
import { mountPismoAuthHeaders } from 'utils';
import RenderIf from 'components/RenderIf';
import { Loader } from 'components/commons';
import debounce from 'lodash.debounce';
import moment from 'moment';

const categoriesData = [
  { label: 'All', name: '', query: {} },
  {
    label: 'Credits',
    name: 'CREDIT',
    query: { category: 'CREDIT' },
  },
  { label: 'Debits', name: 'DEBIT', query: { category: 'DEBIT' } },
  {
    label: 'Denied',
    name: 'REFUSAL',
    query: { type: 'TRANSACTION', category: 'REFUSAL' },
  },
  { label: 'Cash In', name: 'CASHIN', query: { type: 'TRANSACTION' } },
  { label: 'Cash Out', name: 'CASHOUT', query: { type: 'TRANSACTION' } },
  { label: 'Disputes', name: 'dispute', query: { type: 'dispute' } },
  { label: 'Transfers', name: 'TRANSFER', query: { type: 'TRANSFER' } },
  { label: 'Purchases', name: 'PURCHASE', query: { type: 'TRANSFER' } },
];

export default class TimelineComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      has_next: false,
      next_cursor: null,
      category: '',
      currentIndex: 0,
      loading: false,
      selectedDateRange: [{ startDate: null, endDate: null }],
      hasScroll: undefined,
    };
    this.debounceFetchEvents = debounce(this.fetchEventsDebounce, 500);
  }
  componentDidMount() {
    this.fetchEvents({ scrollEnd: false });
  }

  setCategory = (category) => {
    this.setState({ category });
  };

  fetchEventsDebounce = () => {
    this.fetchEvents({
      scrollEnd: false,
      dateRange: this.state.selectedDateRange[0],
    });
  };

  setCurrentIndex = (currentIndex) => {
    this.setState(
      {
        currentIndex,
        rows: [],
        has_next: false,
        next_cursor: null,
      },
      this.debounceFetchEvents,
    );
  };
  setDateRange = (dateRange) => {
    this.setState({ selectedDateRange: [dateRange] });
  };

  fetchEvents = ({ scrollEnd = false, dateRange = null }) => {
    if (this.state.loading) return;
    const { has_next, next_cursor, currentIndex } = this.state;
    // Stopping API if hasnext is false and scroll end is true
    if (has_next === false && scrollEnd === true) return;
    let nextCursorParam =
      !has_next || !scrollEnd ? {} : { nextCursor: next_cursor };
    // Preparing Dates
    dateRange = dateRange ?? {};
    let range = { ...dateRange };
    let datesParam = {};
    if (Boolean(range?.startDate) && Boolean(range?.endDate)) {
      datesParam = {
        beginDate: moment(range?.startDate).startOf('day').toISOString(),
        endDate: moment(range?.endDate).endOf('day').toISOString(),
      };
    }
    this.setState({ loading: true });
    TimelineClient({
      method: 'GET',
      url: '/v1/timeline',
      // url: 'https://api-sandbox.pismolabs.io/events/v4/timeline',
      params: {
        limit: 20,
        ...categoriesData[currentIndex]?.query,
        ...nextCursorParam,
        ...datesParam,
      },
      headers: {
        ...mountPismoAuthHeaders({}),
        'X-Account-Id': sessionStorage.getItem('pismo-account-id'),
      },
    })
      .then(({ data }) => {
        if (!data?.items || !Array.isArray(data?.items)) return;
        this.setState(
          (prev) => {
            const nextData = {
              has_next: data?.has_next && data?.items?.length > 0,
              next_cursor: data?.next_cursor,
              loading: false,
            };
            if (Boolean(scrollEnd))
              return { rows: [...prev.rows, ...data?.items], ...nextData };
            return { rows: data?.items, ...nextData };
          },
          () => {
            this.reFetchEvents(dateRange, data?.items);
          },
        );
        // debugger;
      })
      .catch((e) => {
        this.setState({ loading: false });
        alert('unable to fetch events');
      });
  };

  reFetchEvents = (dateRange) => {
    if (!Boolean(this.state.hasScroll) && this.state.has_next)
      this.fetchEvents({ scrollEnd: true, dateRange: dateRange });
  };

  componentDidUpdate() {
    if (Boolean(this.state.hasScroll)) return;
    this.reFetchEvents(this.state.selectedDateRange[0]);
  }

  render() {
    const {
      rows,
      category,
      currentIndex,
      has_next,
      loading,
      next_cursor,
      selectedDateRange,
    } = this.state;
    return (
      <div>
        <CategorySelector
          category={category}
          categoriesData={categoriesData}
          currentIndex={currentIndex}
          setCurrentIndex={this.setCurrentIndex}
          dateRange={this.state.selectedDateRange[0]}
        />
        <TimelineSearchFilter
          selectedDateRange={selectedDateRange}
          setDateRange={this.setDateRange}
          fetchEvents={this.fetchEvents}
        />
        <RenderIf render={loading && rows.length === 0}>
          <Loader />
        </RenderIf>
        <RenderIf render={!loading || rows.length > 0}>
          <TimeLineResult
            rows={rows}
            fetchEvents={this.fetchEvents}
            has_next={has_next}
            next_cursor={next_cursor}
            dateRange={this.state.selectedDateRange[0]}
            loading={loading}
            setHasScroll={(hasScroll) => {
              this.setState({ hasScroll });
            }}
          />
        </RenderIf>
      </div>
    );
  }
}
