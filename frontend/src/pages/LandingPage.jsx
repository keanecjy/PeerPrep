import { Grid, Typography, Box } from '@material-ui/core';
import AuthSection from './AuthSection';

const LandingPage = () => {
  return (
    <Grid
      container
      spacing={10}
      style={{
        height: 'calc(100vh - 64px)',
        flexGrow: 1,
        padding: 20,
        width: '100%',
        margin: 0,
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12} sm={10} md={8} lg={5} style={{ minWidth: 460 }}>
        <Box>
          <Typography variant="h2" gutterBottom>
            Get better today!
          </Typography>
          <Typography variant="h5" component="p">
            PeerPrep is a collaborative coding platform for you to practise
            coding interviews. Match with a partner and start coding with them
            now!
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={10} md={8} lg={5}>
        <AuthSection />
      </Grid>
    </Grid>
  );
};

export default LandingPage;
