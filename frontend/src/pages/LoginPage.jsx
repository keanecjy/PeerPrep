import { Grid, Typography, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import { LoginCard } from '../components/LoginCard';

const LoginPage = () => {
  const [status, setStatus] = useState('');

  return (
    <Grid container spacing={5} style={{ height: '100vh' }}>
      <Grid item xs style={{ margin: 'auto 30px', minWidth: 460 }}>
        <Typography variant="h2" gutterBottom style={{ marginTop: 10 }}>
          Get better today!
        </Typography>
        <Typography variant="h6" component="p" align="justify">
          PeerPreps a coding collaborative platform… dummy words to fill up the
          space… dummy words to fill up the space… dummy words to fill up the
          space… dummy words to fill up the space… dummy words to fill up the
          space… dummy words to fill up the space… dummy words to fill up the
          space… dummy words to fill up the space… dummy words to fill up the
          space… dummy words to fill up the space… dummy words to fill up the
          space… dummy words to fill up the space… dummy words to fill up the
          space…
        </Typography>
      </Grid>
      <Grid item xs style={{ margin: 'auto 30px' }}>
        <Paper
          style={{
            margin: 'auto',
            minHeight: 300,
            minWidth: 430,
            maxWidth: 460,
            padding: 20,
          }}
        >
          <LoginCard status={status} setStatus={setStatus} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
