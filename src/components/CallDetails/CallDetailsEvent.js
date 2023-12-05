import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

class CallDetailsEvent extends Component {
  render() {
    const { label, additional_info } = this.props;
    const { text, transformedOld, transformedNew } = additional_info;

    return (
      <div className="pv2 pv3-ns pismo-darker">
        <div className="f4 f3-ns b">{label}</div>

        <div className="bl b--pismo-light-silver pl3dot5">
          <div className="pismo-light-silver f7 f6-ns mv3 strike">
            {transformedOld.map((pair, index) => (
              <div key={index}>
                <FormattedMessage id={`formLabels.${pair.key}`} />: {pair.value}
              </div>
            ))}
          </div>

          <div className="f7 f6-ns mv3">
            {transformedNew.map((pair, index) => (
              <div key={index}>
                <FormattedMessage id={`formLabels.${pair.key}`} />: {pair.value}
              </div>
            ))}
          </div>
        </div>

        {text && text.length > 0 && (
          <div className="f7 f6-ns fw4 pt1">— {text}</div>
        )}
      </div>
    );
  }
}

export default CallDetailsEvent;
