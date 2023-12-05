import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

class ProgramSelectorTrigger extends Component {
  render() {
    const { customer, displayName, user, intl } = this.props;
    const { entity, programs, program } = customer;
    const { isCustomer } = user;

    const { name: customerName = '...' } = entity;
    const splitNames = customerName.split(' ');
    const firstName = splitNames[0];
    const lastName = splitNames[splitNames.length - 1];
    const customerShortName = `${firstName}${
      splitNames.length > 1 ? ` ${lastName}` : ''
    }`;

    let programName = '';

    if (isCustomer) {
      programName = program.type_name;
    } else {
      const currentProgram = programs.find((p) => p.isCurrent) || {};
      programName = currentProgram.program_name;
    }

    const containerClasses = 'w-100 dib v-mid tr white pointer';
    const nameClasses = `pb1 ${customerName.length >= 24 ? 'f7' : 'f5'}`; // totally arbitrary
    const programClasses = 'tc f7dot5 fw4';

    return (
      <div className={containerClasses}>
        {displayName && <div className={nameClasses}>{customerShortName}</div>}
        <div className={programClasses}>
          {programName &&
            intl.formatMessage({
              id: programName.toLowerCase(),
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ programSelector, customer, user }, props) => ({
  programSelector,
  customer,
  user,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(ProgramSelectorTrigger));
