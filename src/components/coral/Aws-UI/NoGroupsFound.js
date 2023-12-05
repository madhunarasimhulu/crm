import { Button, Grid, Paper } from '@material-ui/core';
import { Auth } from 'aws-amplify';
import WarningIcon from '@material-ui/icons/Warning';

export default function NoGroupsFound({ msg }) {
  return (
    <Paper
      color="white"
      style={{
        width: '30%',
        display: 'flex',
        margin: '0 auto',
        marginTop: 50,
        alignContent: 'center',
        boxShadow: '0px 4px 25px 5px rgba(36, 86, 113, 0.2)',
      }}
    >
      <Grid
        container
        style={{
          padding: 20,
        }}
      >
        <Grid
          item
          container
          justifyContent="flex-start"
          style={{
            border: '1px solid #FE6F61',
            borderRadius: 2,
            padding: 10,
          }}
        >
          <Grid item sm={2} md={2} lg={2}>
            <WarningIcon />
          </Grid>
          <Grid item sm={10} md={10} lg={10}>
            <span style={{ fontWeight: 600 }}>{msg}</span>
          </Grid>
        </Grid>
        <Grid item container style={{ marginTop: 20 }}>
          <Button
            variant="contained"
            style={{
              background: '#FE6F61',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 600,
            }}
            onClick={() => {
              Auth.signOut();
            }}
            fullWidth
          >
            Sign Out
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
