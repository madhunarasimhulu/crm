import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Loader } from '../../commons';
import SummaryEvent from './SummaryEvent';
import { getTimelineEvents } from '../../../actions';

const SummaryEvents = (props) => {
  const {
    user: { isCustomer },
    timeline,
    credentials,
    accountId,
    dispatch,
    payCTAHandler,
    org,
    setModalItem,
    setOpen,
  } = props;
  const { pages, isLoading, next_page, items } = timeline;

  const timelineEventsParams = {
    pages,
    credentials,
    isCustomer,
    accountId,
    isPrePaid: false,
    shouldStartLoading: true,
  };

  const loadNextPage = () => {
    if (next_page && !isLoading) {
      let countTimeline = timelineEventsParams.pages;
      countTimeline++;
      timelineEventsParams.pages = countTimeline;
      dispatch(getTimelineEvents(timelineEventsParams));
    }
  };

  const itemCount = next_page ? items.length + 1 : items.length;
  const loadMoreItems = isLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index) => !next_page || index < items.length - 1;

  const itemRenderer = ({ style, index }) => {
    if (!isItemLoaded(index)) {
      return (
        <div className="pa4 white tc" style={style}>
          <Loader size="small" />
        </div>
      );
    }
    const key =
      items[index]?.tenant_account_timestamp || items[index]?.data.item.id || 0;
    return (
      <SummaryEvent
        event={items[index]}
        key={`${key}_${index}`}
        payCTAHandler={payCTAHandler}
        style={style}
        org={org}
        onClick={(modalItem) => {
          setModalItem(modalItem);
          setOpen(true);
        }}
      />
    );
  };

  return (
    <AutoSizer>
      {({ width, height }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              width={width}
              height={height}
              itemCount={itemCount}
              itemSize={136}
              ref={ref}
              onItemsRendered={onItemsRendered}
            >
              {itemRenderer}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

export default SummaryEvents;
