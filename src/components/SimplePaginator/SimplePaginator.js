import { injectIntl } from 'react-intl';
import { Button } from '../commons';

function SimplePaginator({
  currentPage,
  totalPages,
  onPreviousClick = () => {},
  onNextClick = () => {},
  intl,
}) {
  return (
    <div className="flex items-center justify-center bg-white bt b--light-gray">
      <Button
        text={`< ${intl.formatMessage({
          id: 'general.pagination.previous',
        })} `}
        onClick={() => onPreviousClick()}
        disabled={currentPage === 1}
      />
      <span className="mh1">
        {intl.formatMessage({ id: 'general.pagination.page' })}
      </span>
      <span className="mh1">{currentPage}</span>
      <span className="mh1">
        {intl.formatMessage({ id: 'general.pagination.of' })}
      </span>
      <span className="mh1">{totalPages}</span>
      <Button
        text={` ${intl.formatMessage({
          id: 'general.pagination.next',
        })} >`}
        onClick={() => onNextClick()}
        disabled={currentPage === totalPages}
      />
    </div>
  );
}

export default injectIntl(SimplePaginator);
