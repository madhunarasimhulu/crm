import Nav from './Nav';
import './CustomerSearch.scss';
import Search from './Search';
import { Grid } from '@material-ui/core';

export default function CustomerSearch() {
  return (
    <div
      style={{ height: '100vh' }}
      // justifyContent="flex-start"
      // direction="column"
    >
      <Grid item sm={2} md={2} lg={2} xs={2}></Grid>
      <Grid item container style={{ marginTop: window.innerHeight * 0.2 }}>
        <Search />
      </Grid>
    </div>
  );
}
