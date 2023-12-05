import { FormControl, MenuItem, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { Button } from 'components/commons';
import React, { useState } from 'react';
import { submitNewServiceRequest, showToast } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { name } from '../../../package.json';

export default function NewServiceRequest() {
  const dispatch = useDispatch();
  const { isLoading, groups } = useSelector((state) => state.cards);
  const customer = useSelector((state) => state.customer);
  const { isLoading: serviceRequestLoading } = useSelector(
    (state) => state.serviceRequest,
  );
  const initialServiceRequest = {
    requestMode: name,
    selectedCard: '',
    serviceCategory: '',
    subCategory: '',
    AdditionalRemarks: '',
  };
  const [serviceRequest, SetServiceRequest] = useState({
    ...initialServiceRequest,
  });

  const CategoryList = [
    'Card',
    'Statement',
    'Limits',
    'Details',
    'Transactions',
    'Communication',
    'Others',
  ];
  const subCategoryList = [
    [
      'Report lost or stolen card',
      'Reissue/ Replace card',
      'Card activation',
      'Add on card',
      'Card dispatch status',
      'Credit card closure',
    ],
    [
      'Request for a duplicate statement',
      'OTP for E-statement',
      'Change Due date',
      'Download issue',
    ],
    ['Update travel Plan', 'Spend limit issues', 'Update credit limit'],
    [
      'International number update',
      'Phone number Update',
      'Address update',
      'Name change',
      'Mother name',
      'Marital status',
      'Gender',
    ],
    [
      'Recurring transactions',
      'NACH',
      'Credit Balance Refund',
      'Fee and Charges',
      'Dispute Transaction',
      'Track Dispute',
    ],
    ['WhatsApp connect', 'OTP for IVR/Moto'],
    ['Track Service Request', 'Others'],
  ];

  const handleServiceRequestChange = (event) => {
    const { name, value, type, checked } = event.target;

    SetServiceRequest((prev) => {
      if (name === 'serviceCategory') {
        return {
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
          subCategory: '',
        };
      } else {
        return {
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        };
      }
    });
  };

  const handleServiceRequestSubmit = async () => {
    if (serviceRequest.subCategory) {
      dispatch(
        submitNewServiceRequest({
          requestorDetails: {
            sourceSystem: serviceRequest.requestMode,
            sourceUserId: customer.entity.document_number,
          },
          orgId: customer.organization.id,
          accountId: customer.accountId,
          customerId: customer.customerId,
          cardId: serviceRequest.cardId,
          documentNumber: customer.entity.document_number,
          customerName: customer.entity.name,
          requestType: serviceRequest.subCategory,
          additionalData: { reason: serviceRequest.AdditionalRemarks },
          comments: serviceRequest.AdditionalRemarks,
        }),
      ).then(() => SetServiceRequest({ ...initialServiceRequest }));
    } else {
      window.setTimeout(() => {
        dispatch(
          showToast({
            message: 'please select Service Category and Service Type',
            style: 'error',
          }),
        );
      }, 1000);
    }
  };
  return (
    <div>
      <form>
        <FormControl disabled className="w-100">
          <Typography className="serviceRequestTitle">Request Mode</Typography>
          <Select
            onChange={handleServiceRequestChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            className="serviceRequestField fieldBlocked"
            name="RequestMode"
            value={serviceRequest.requestMode}
          >
            <MenuItem value={serviceRequest.requestMode}>
              {serviceRequest.requestMode}
            </MenuItem>
          </Select>
        </FormControl>
        <Typography className="serviceRequestTitle">Select Card</Typography>
        <Select
          onChange={handleServiceRequestChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          className="serviceRequestField"
          name="selectedCard"
          value={serviceRequest.selectedCard}
        >
          <MenuItem value="">
            <em>Select card</em>
          </MenuItem>
          {groups.map((group) =>
            group.cards.map((card) => (
              <MenuItem value={card.id + '-' + group.customer.id} key={card.id}>
                {card?.last_4_digits +
                  ' || ' +
                  card?.name +
                  ' || ' +
                  card?.status}
              </MenuItem>
            )),
          )}
        </Select>
        <Typography className="serviceRequestTitle">
          Service Category
        </Typography>
        <Select
          onChange={handleServiceRequestChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          className="serviceRequestField"
          name="serviceCategory"
          value={serviceRequest.serviceCategory}
        >
          <MenuItem value="">
            <em>Select Category</em>
          </MenuItem>
          {CategoryList.map((Category, k) => {
            return (
              <MenuItem value={Category} key={k}>
                {Category}
              </MenuItem>
            );
          })}
        </Select>
        <Typography className="serviceRequestTitle">Service Type</Typography>
        <Select
          onChange={handleServiceRequestChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          className="serviceRequestField"
          name="subCategory"
          value={serviceRequest.subCategory}
        >
          <MenuItem value="">
            <em>Select Sub-Category</em>
          </MenuItem>
          {CategoryList?.indexOf(serviceRequest?.serviceCategory) !== -1 &&
            subCategoryList[
              CategoryList?.indexOf(serviceRequest?.serviceCategory)
            ].map((subCategory, k) => {
              return (
                <MenuItem value={subCategory} key={k}>
                  {subCategory}
                </MenuItem>
              );
            })}
        </Select>
        <div>
          <Typography className="serviceRequestTitle">
            Additional Remarks
          </Typography>
          <textarea
            onChange={handleServiceRequestChange}
            value={serviceRequest.AdditionalRemarks}
            name="AdditionalRemarks"
            className="serviceRequestField"
            rows="4"
          />
        </div>
        <Button
          disabled={isLoading || serviceRequestLoading}
          text="SUBMIT"
          type="button"
          onClick={handleServiceRequestSubmit}
        />
      </form>
    </div>
  );
}
