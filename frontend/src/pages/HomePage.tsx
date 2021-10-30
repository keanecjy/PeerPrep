import { Grid, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import HistorySection from './HistorySection';
import MatchPage from './MatchPage';

const HomePage = () => {
  const { user } = useContext(UserContext);

  return (
    <Grid
      container
      spacing={4}
      style={{
        flexGrow: 1,
        padding: '10px 50px',
        width: '100%',
        margin: 0,
      }}
      alignItems="flex-start"
      justifyContent="center"
      direction="row-reverse"
    >
      <Grid className="welcome-text" item xs={12} sm={10} md={8} style={{ margin: '1px' }}>
        <Typography variant="h4">
          Welcome Back, {user?.name || 'Guest'}!
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sm={10}
        md={8}
        lg={4}
        direction="column"
        justifyContent="space-between"
      >
        <Grid item>
          <Typography variant="h5" style={{ marginBottom: 10, color: 'white' }}>
            Start a Session
          </Typography>
          <MatchPage />
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sm={10}
        md={8}
        lg={4}
        direction="column"
        justifyContent="space-between"
      >
        <Grid item>
          <Typography variant="h5" style={{ color: 'white' }}>
            Your History
          </Typography>
          <HistorySection />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
