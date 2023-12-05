import React from 'react';
import { connect } from 'react-redux';
import Card from './Card';
// import CardOnFile from './CardOnFile';
// import { programTypes } from '../../constants';

const Page = ({ customer, ...props }) => {
  // if (
  //   customer.program.type_name === programTypes.CREDIT ||
  //   customer.program.type_name === programTypes.DEBITOZEROBALANCE ||
  //   customer.program.type_name === programTypes.CREDITZEROBALANCE
  // ) {
  //   return <Card {...props} />;
  // }
  // return <CardOnFile {...props} />;
  return <Card {...props} />;
};

const mapStateToProps = ({ customer }, props) => ({
  customer,
  ...props,
});

export default connect(mapStateToProps)(Page);
