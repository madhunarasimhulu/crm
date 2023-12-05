import Typography from '@material-ui/core/Typography';
import { getAccountCustomerList, resetCards, getServiceHistory } from 'actions';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomerPageWrapper } from '../../components';
import NewServiceRequest from './NewServiceRequest';
import ServiceHistory from './ServiceHistory';
import './ServiceRequests.scss';

export default function ServiceRequests() {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer);
  const user = useSelector((state) => state.user);
  const credentials = useSelector((state) => state.credentials);
  const [serviceRequestType, setServiceRequestType] = useState('NewRequest');
  const { accountId, customerId } = customer;

  useEffect(() => {
    dispatch(getAccountCustomerList(accountId, credentials, user, customer));
    return () => dispatch(resetCards());
  }, []);

  const handleServiceRequestTypeChange = (event) => {
    setServiceRequestType(event.target.value);
  };

  const handleServiceHistory = () => {
    var currentDate = new Date();
    var firstDay = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000);

    dispatch(
      getServiceHistory({
        accountId: accountId,
        customerId: customerId,
        startDate: firstDay.toISOString().split('T')[0],
        endDate: currentDate.toISOString().split('T')[0],
        timeStamp: Date.now(),
      }),
    );
  };

  return (
    <CustomerPageWrapper customer={customer}>
      <div className="w-100 w-86-ns center-ns max-h-100 overflow-y-auto">
        <Typography variant="h6" className="pv2-ns">
          <center>Service Request</center>
        </Typography>
        <div className="serviceRequest">
          <input
            type="radio"
            id="NewRequest"
            name="type"
            value="NewRequest"
            checked={serviceRequestType === 'NewRequest'}
            onChange={handleServiceRequestTypeChange}
            hidden
          />
          <input
            type="radio"
            id="ServiceHistory"
            name="type"
            value="ServiceHistory"
            checked={serviceRequestType === 'ServiceHistory'}
            onChange={handleServiceRequestTypeChange}
            hidden
          />
          <div className="serviceTypeGroup">
            <label
              htmlFor="NewRequest"
              className={`serviceType ${
                serviceRequestType === 'NewRequest' ? 'serviceTypeActive' : ''
              }`}
            >
              <center>New Request</center>
            </label>
            <label
              htmlFor="ServiceHistory"
              className={`serviceType ${
                serviceRequestType === 'ServiceHistory'
                  ? 'serviceTypeActive'
                  : ''
              }`}
              onClick={handleServiceHistory}
            >
              <center>Service History</center>
            </label>
          </div>
          {serviceRequestType === 'NewRequest' ? (
            <NewServiceRequest />
          ) : (
            <ServiceHistory />
          )}
        </div>
      </div>
    </CustomerPageWrapper>
  );
}
