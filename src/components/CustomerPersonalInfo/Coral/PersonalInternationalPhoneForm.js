import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import PhoneIcon from '@material-ui/icons/Phone';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { useEffect, useState } from 'react';
import { Button, IconButton } from '@material-ui/core';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Auth } from 'aws-amplify';
import RenderIf from 'components/RenderIf';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { TenantConfig } from 'utils/coral/TenantConfig';

const avaya_calling_url = process.env.REACT_APP_AVAYYA_CALLING_URL;

export default function PersonalInternationalPhoneForm({ phones: propPhones }) {
  const [phones, setPhones] = useState([]);
  const [executive_user_id, setUserid] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const role = sessionStorage.getItem('role');
  const userGroups = [
    TenantConfig['CL_000CUB|FRM'].role,
    TenantConfig['CL_00UTKB|FRM'].role,
    TenantConfig['CL_00UTKB|CUST_SERVICE'].role,
    TenantConfig['CL_000CUB|CUST_SERVICE'].role,
    TenantConfig['Operations'].role,
  ];

  useEffect(() => {
    if (executive_user_id !== null) return;

    Auth.currentUserInfo().then(({ attributes }) => {
      setUserid(attributes['custom:executive_user_id'] || null);
    });
  }, []);

  useEffect(() => {
    let sortedPhones =
      propPhones?.sort((a, b) => {
        if (a.active && !b.active) {
          return -1;
        }
        if (!a.active && b.active) {
          return 1;
        }
        return 0;
      }) || [];
    // Finding Primary Phone Number
    let primaryPhoneIndex = sortedPhones.findIndex(({ type }) => {
      if (!!!type) return null;
      return type === 'MOBILE';
    });
    sortedPhones[primaryPhoneIndex].isPrimary = true;
    setPhones(sortedPhones);
  }, [propPhones]);

  if (phones.length === 0)
    return (
      <center>
        <h4>No Phones Numbers Found</h4>
      </center>
    );

  const handleMaskPhoneNumber = (i) => {
    let prev = !!phones[i]?.mask;
    phones[i].mask = !prev;
    setPhones([...phones]);
  };

  // let canUnmask = !String(phones[0]?.number).includes('*');
  let canUnmask = !userGroups.includes(role);

  const totalPages = Math.ceil(phones.length / rowsPerPage);
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="custPhones">
      <TableContainer className="custPhones_tbl_container">
        <Table stickyHeader aria-label="sticky table">
          <TableHead className="cust_tableHead">
            <TableRow>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Country Code</TableCell>
              <TableCell align="center">Area Code</TableCell>
              <TableCell align="center">Number</TableCell>
              <RenderIf render={canUnmask}>
                <TableCell align="center"></TableCell>
              </RenderIf>
              <TableCell align="center">Status</TableCell>
              {/* <RenderIf render={canUnmask}> */}
              <TableCell align="center"></TableCell>
              {/* </RenderIf> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {phones
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((phone, i) => {
                let calling_url = avaya_calling_url
                  .replace('{{executive_user_id}}', executive_user_id)
                  .replace('{{phone_number}}', phone?.number);
                let isPrimary = Boolean(phone?.isPrimary);
                return (
                  <TableRow
                    key={i}
                    className={isPrimary ? '' : 'cust_Tr_Non_Primary'}
                  >
                    <TableCell align="center" className="cust_MobileType">
                      {String(phone?.type).toLowerCase()}
                    </TableCell>
                    <TableCell align="center">{phone?.country_code}</TableCell>
                    <TableCell align="center">{phone?.area_code}</TableCell>
                    <TableCell align="center">
                      <MaskPhoneNumber
                        phoneNumber={phone?.number}
                        mask={phone?.mask}
                      />
                    </TableCell>
                    <RenderIf render={canUnmask}>
                      <TableCell align="center">
                        <div className="custPhonesIconButton">
                          <IconButton
                            disableRipple={true}
                            onClick={() => handleMaskPhoneNumber(i)}
                          >
                            {!!!phone?.mask ? (
                              <VisibilityIcon className="Cust_visibleIcon" />
                            ) : (
                              <VisibilityOffIcon className="Cust_visibleIcon" />
                            )}
                          </IconButton>
                        </div>
                      </TableCell>
                    </RenderIf>
                    <TableCell align="center">
                      <StatusLabel stat={phone?.active} isPrimary={isPrimary} />
                    </TableCell>
                    {/* <RenderIf render={canUnmask}> */}
                    <TableCell align="center">
                      <div className="custPhonesIconButtonCall">
                        <Button
                          className={
                            phone?.active && !!executive_user_id
                              ? 'custPhones_callButton'
                              : 'custPhones_callButton_inactive'
                          }
                          onClick={
                            phone?.active && !!!executive_user_id
                              ? null
                              : () => {
                                  window.open(calling_url);
                                }
                          }
                        >
                          <PhoneIcon className="custPhones_callIcon" />
                        </Button>
                      </div>
                    </TableCell>
                    {/* </RenderIf>s */}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <RenderIf render={propPhones.length > 10}>
        <PageNation
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </RenderIf>
    </div>
  );
}

function StatusLabel({ stat, isPrimary }) {
  if (isPrimary) return <span style={{ color: '#24B500' }}>Primary</span>;

  return (
    <span style={{ color: stat ? '#24B500' : '#EEA058' }}>
      {stat ? 'Active' : 'Inactive'}
    </span>
  );
}

function MaskPhoneNumber({ mask, phoneNumber }) {
  // if- mask = true then masking

  if (mask === undefined || mask === false)
    phoneNumber = phoneNumber.replace(/(?<=\d{2})\d(?=\d{3})/g, '*');

  return <span>{phoneNumber}</span>;
}

function PageNation({ page, totalPages, handlePageChange }) {
  return (
    <div className="custPhones_Pagenation_container">
      <div className="custPhones_Pagenation">
        <button
          className="custPhones_Pagenation_btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          <ArrowBackIosIcon className="custPhones_Pagenation_Icon_left" />
        </button>
        <span className="custPhones_Pagenation_count">{`Page ${
          page + 1
        } of ${totalPages}`}</span>
        <button
          className="custPhones_Pagenation_btn"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
        >
          <ArrowForwardIosIcon className="custPhones_Pagenation_Icon_right" />
        </button>
      </div>
    </div>
  );
}
