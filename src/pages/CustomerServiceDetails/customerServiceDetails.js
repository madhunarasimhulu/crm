import { CustomerPageWrapper } from 'components';
import React, { Component } from 'react';
import './customerServiceDetails.scss';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

// export default function customerServiceDetails() {
//   return (
//     <CustomerPageWrapper>
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <div className="service-div">
//           <h3 style={{ textDecoration: 'underline' }}>
//             <b>Customer Service</b>
//           </h3>
//           <div>
//             <label>Toll-Free No: 18003093665 </label>
//           </div>
//           <div>
//             <label>Email ID: creditcards@utkarsh.bank </label>
//           </div>
//         </div>
//       </div>
//     </CustomerPageWrapper>
//   );
// }

// import React, { Component } from 'react'

export class customerServiceDetails extends Component {
  render() {
    const { ui } = this.props;
    const { isMobile } = ui;
    return (
      <div>
        <CustomerPageWrapper>
          {isMobile && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="service-div">
                <h3 style={{ textDecoration: 'underline' }}>
                  <b>Customer Service</b>
                </h3>
                <div>
                  <label>Toll-Free No: 18003093665 </label>
                </div>
                <div>
                  <label>Email ID: creditcards@utkarsh.bank </label>
                </div>
              </div>
            </div>
          )}
        </CustomerPageWrapper>
      </div>
    );
  }
}

const mapStateToProps = ({ ui, user, customer, attendanceNotes }, props) => ({
  ui,
  user,
  customer,
  attendanceNotes,
  ...props,
});

export default connect(mapStateToProps)(injectIntl(customerServiceDetails));
