import { Grid, Typography } from '@material-ui/core';
import '../CustomerSearch.scss';

export default function SearchBoxItem({ customer }) {
  let { name, email, document_number, last_4_digits, program_name } = customer;
  return (
    <Grid
      container
      item
      sm={12}
      md={12}
      lg={12}
      xs={12}
      direction="row"
      justifyContent="space-between"
      className="resultBox"
    >
      <Grid
        item
        container
        xs={12}
        sm={6}
        md={6}
        lg={6}
        direction="column"
        justifyContent="space-between"
      >
        <Grid item>
          <Typography className="sbox_item_name">{name}</Typography>
        </Grid>
        <Grid item>
          <Typography className="sbox_item_name">{document_number}</Typography>
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sm={6}
        md={6}
        lg={6}
        direction="column"
        justifyContent={'space-between'}
        alignContent="flex-end"
        alignItems="flex-end"
      >
        <Grid item>
          <Typography className="sbox_item_email">{email}</Typography>
        </Grid>
        <Grid item>
          <Typography className="sbox_item_program">{`${program_name} ${
            !!last_4_digits ? `[**${last_4_digits ?? '****'}]` : ''
          }`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
