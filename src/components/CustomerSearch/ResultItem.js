import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from 'react-user-avatar';
import { connect } from 'react-redux';
import { possibleAvatarColors } from '../../constants';
import { formatCPFCNPJ, isCreditProgramType } from '../../utils';

import './ResultItem.scss';

const CustomerSearchResultItem = ({
  name,
  program_name,
  email,
  last_4_digits,
  customer_id,
  account_id,
  program_type,
  index,
  selectedResult,
  isMobile,
  document_number,
  bank_account,
  agency,
  account_number,
  account_digit,
}) => {
  const isActive = index === selectedResult;

  const containerClasses = `
    pa3 bb b--pismo-mid-gray CustomerSearchResultItem
    ${
      isActive
        ? 'near-white bg-pismo-dark-blue active'
        : 'pismo-near-black hover-near-white hover-bg-pismo-dark-gray'
    }
  `;

  const rowClasses = '';
  const firstColumnClasses = 'dib v-mid w-60';
  const secondColumnClasses = 'dib v-mid w-40 f7 tr';

  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  const fullName = `${firstName} ${lastName}`;

  const linkBasePath = `/customers/${customer_id}/accounts/${account_id}`;
  let linkPath;
  let programOrDocInfo;
  let cardOrAccInfo;

  if (isMobile) {
    linkPath = `${linkBasePath}/summary`;
  } else if (isCreditProgramType(program_type)) {
    linkPath = linkBasePath; // statements
    programOrDocInfo = `${program_name} (${program_type})`;
    cardOrAccInfo = `**** ${last_4_digits}`;
  } else {
    linkPath = `${linkBasePath}/debit?range=7`;
    programOrDocInfo = `${program_name} (${program_type})`;
    cardOrAccInfo = formatCPFCNPJ(document_number) || '';
  }

  return (
    <Link to={linkPath}>
      <article className={containerClasses}>
        <div className="w-17 w-14-ns dib v-mid tl">
          <UserAvatar size="36" name={fullName} colors={possibleAvatarColors} />
        </div>

        <div className="w-83 w-86-ns dib v-mid">
          <div className="dn db-ns">
            <div className={`${rowClasses} mb2`}>
              <div
                className={`${firstColumnClasses} f5`}
                data-testid="test-name"
              >
                {name}
              </div>
              <div className={secondColumnClasses}>{programOrDocInfo}</div>
            </div>

            <div className={`${rowClasses} f7 pismo-light-silver`}>
              <div className={firstColumnClasses}>{email}</div>
              <div className={secondColumnClasses}>{cardOrAccInfo}</div>
            </div>
          </div>

          <div className="db dn-ns">
            <div className="w-100 pb2">{name}</div>
            <div className="w-100 f6">
              {programOrDocInfo}&nbsp; {cardOrAccInfo}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

const mapStateToProps = ({ ui }, props) => ({
  isMobile: ui.isMobile,
  ...props,
});

export default connect(mapStateToProps)(CustomerSearchResultItem);
