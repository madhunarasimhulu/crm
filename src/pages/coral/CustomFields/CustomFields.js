import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ReactJson from 'react-json-view';
import { useEffect, useState } from 'react';
import { Customers } from 'clients';
import { useDispatch } from 'react-redux';
import { showToast } from 'actions';
import { Loader } from 'components/commons';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function CustomFields({ accountId }) {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);

  const dispatch = useDispatch();
  let showMessage = (message, style = 'error') =>
    dispatch(
      showToast({
        message,
        style,
      }),
    );

  const classes = useStyles();

  useEffect(() => {
    getCustomFields();
  }, []);

  const getCustomFields = async () => {
    setLoading(true);
    let resp = await Customers.getAccountStatus(accountId).catch((e) => null);
    setLoading(false);
    if (!resp) return showMessage('Unable to get Account Details');
    let customFields;
    try {
      if (!resp?.data?.custom_fields) customFields = {};
      else customFields = JSON.parse(resp.data.custom_fields);
    } catch (error) {
      customFields = {};
    }
    setFields(Object.entries(customFields));
  };

  if (loading) return <Loader />;

  if (fields.length === 0)
    return (
      <center style={{ padding: 20 }}>
        <strong>No Custom Fields</strong>
      </center>
    );

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: '#5863742e' }}>
            <TableRow>
              <TableCell width={10}>SNo</TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map(([key, value], i) => (
              <TableRow key={i}>
                <TableCell component="th">{i + 1}</TableCell>
                <TableCell>{key}</TableCell>
                <TableCell>
                  {typeof value === 'object' ? (
                    <ReactJson
                      src={value}
                      name={false}
                      enableClipboard={false}
                      collapsed={true}
                      displayDataTypes={false}
                    />
                  ) : (
                    value
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
