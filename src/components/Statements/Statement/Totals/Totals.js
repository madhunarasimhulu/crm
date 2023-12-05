import React from 'react';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';

const Totals = ({ totals, org }) => {
  const listItemClasses =
    'db cb w-100 pv3 bb b--pismo-lighter-gray animate-all';

  const totalItemAnimationStyle = {
    entering: 'o-0 mt3',
    entered: 'o-100',
    exited: 'o-0 mt3',
    exiting: 'o-100',
  };

  return (
    <div className="bg-white f6 overflow-y animate-all">
      <ul className="list pa0 ma0">
        {totals.list.map((total, index) => (
          <Transition appear in timeout={100 * (index + 1)} key={index}>
            {(state) => (
              <li
                className={`${listItemClasses} ${totalItemAnimationStyle[state]}`}
              >
                <div className="w-100 ph4">
                  <div
                    className={`dib v-mid w-two-thirds tl f7 f6-ns ${
                      total.name === 'credits' ? 'pismo-blue' : ''
                    }`}
                  >
                    <FormattedMessage id={`totals.${total.name}`} />
                  </div>

                  <div className="dib v-mid w-third tr">
                    {total.type === 'currency' ? (
                      <span>
                        <span>{org.currency}</span>{' '}
                        <FormattedNumber
                          value={total.value}
                          minimumFractionDigits={2}
                        />
                      </span>
                    ) : (
                      <span>{total.value}</span>
                    )}
                  </div>
                </div>
              </li>
            )}
          </Transition>
        ))}
      </ul>
    </div>
  );
};

const mapStateToProps = ({ ui, org }, props) => ({
  ui,
  org,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(Totals));
