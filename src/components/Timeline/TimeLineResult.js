import SummryEventDetailsModal from 'components/CustomerResume/SummaryEvents/Coral/SummryEventDetailsModal';
import RenderIf from 'components/RenderIf';
import { Loader } from 'components/commons';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

function getTrnsAmount(amount) {
  amount = Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'INR',
  });
  if (String(amount).includes('.')) return `${amount}`;
  return `${amount}.00`;
}

export default function TimeLineResult({
  rows,
  fetchEvents,
  loading,
  setHasScroll,
  dateRange,
}) {
  const scrollRef = useRef(null);
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(null);
  const handleScrollEnd = async () => {
    if (loading) return;
    const scrollContainer = scrollRef.current;
    const scrollHeight = scrollContainer.scrollHeight;
    const scrollTop = scrollContainer.scrollTop;
    const clientHeight = scrollContainer.clientHeight;

    if (scrollHeight - scrollTop <= clientHeight) {
      setRefresh(Math.random(1));
    }
  };

  useEffect(() => {
    fetchEvents({ scrollEnd: true, dateRange });
  }, [refresh]);

  useEffect(() => {
    scrollRef?.current?.addEventListener('scroll', handleScrollEnd);

    return () => {
      scrollRef?.current?.removeEventListener('scroll', handleScrollEnd);
    };
  }, []);

  const checkScroll = () => {
    const scrollElement = scrollRef?.current;
    if (scrollElement) {
      const hasVerticalScroll =
        scrollElement.scrollHeight > scrollElement.clientHeight;
      return hasVerticalScroll;
    }
    return null;
  };

  useEffect(() => {
    if (scrollRef?.current) setHasScroll(checkScroll());
  }, [rows]);

  return (
    <>
      <RenderIf render={rows?.length === 0}>
        <center>
          <h3>Events not found.</h3>
        </center>
      </RenderIf>
      <RenderIf render={rows?.length > 0}>
        <div className="w-100 mw7-ns center-ns pt3-ns bg-white timeline_result_main">
          <SummryEventDetailsModal data={data} setOpen={setOpen} open={open} />
          <div className="timeline_result_second">
            <div
              className="list pa0 ma0 timeline_result_scroll"
              ref={scrollRef}
            >
              <ul>
                {rows.map((row, i) => {
                  const item = row?.data?.item || {};
                  const date = moment(row?.timestamp).format('DD-MMM');
                  const time = moment(row?.timestamp).format('hh:MM:ss A');
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        setData(row?.data?.item);
                        setOpen(true);
                      }}
                      className="db cb w-100 pa3 bb b--pismo-lighter-gray animate-all pismo-dark-blue hover-bg-pismo-light-gray o-100 flex pointer timeline_result_li"
                    >
                      <div className="w-15  pismo-light-silver flex flex-column justify-center">
                        <div className="f4">{date}</div>
                        <div className="f7">{time}</div>
                      </div>
                      <div className="w-70 flex flex-column justify-center">
                        <div className="f5 mb1 ttu ${}">{row?.type}</div>
                        <RenderIf
                          render={Boolean(item?.merchant_category_group)}
                        >
                          <div className="f6 mb2 ttu">
                            {item?.soft_descriptor}
                            <span>
                              {' '}
                              [{item?.merchant_city},{' '}
                              {item?.merchant_state_or_country}]
                            </span>
                          </div>
                        </RenderIf>
                        <div
                          className="f5 pismo-light-silver"
                          style={{ textTransform: 'capitalize' }}
                        >
                          {String(row?.category).toLowerCase()}
                        </div>
                      </div>
                      <div className="w-25 tr flex flex-column">
                        <div className="f4 mb1 b pismo-light-silver transaction-rejected">
                          <RenderIf render={row?.type === 'ADJUSTMENT'}>
                            <span className="cblack">
                              {getTrnsAmount(item?.amount)}
                            </span>
                          </RenderIf>
                          <RenderIf
                            render={
                              row?.type === 'TRANSACTION' ||
                              row?.type === 'CONFIRMATION'
                            }
                          >
                            <span
                              className={
                                row?.type === 'CONFIRMATION' ? `cblack` : ''
                              }
                            >
                              {getTrnsAmount(item?.contract_amount)}
                            </span>
                          </RenderIf>
                          <RenderIf render={row?.type === 'CARD'}>
                            <CardTransactionType item={item} />
                          </RenderIf>
                        </div>
                      </div>
                    </li>
                  );
                })}
                <RenderIf render={loading}>
                  <li>
                    <Loader />
                  </li>
                </RenderIf>
              </ul>
            </div>

            <div className="resize-triggers">
              <div className="expand-trigger">
                <div style={{ width: '769px', height: '429px' }}></div>
              </div>
              <div className="contract-trigger"></div>
            </div>
          </div>
        </div>
      </RenderIf>
    </>
  );
}

function CardTransactionType({ item }) {
  return (
    <div className="flex flex-column">
      <div className="f4 mb1 b">{item?.name}</div>
      <div className="f5 pismo-light-silver">{item?.printed_name}</div>
    </div>
  );
}
