import { Grid, Typography, Paper, Box } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { CheckConfirmationCard } from '../components/CheckConfirmationCard';
import { ForgetPasswordCard } from '../components/ForgetPasswordCard';
import { LoginCard } from '../components/LoginCard';
import { RegisterCard } from '../components/RegisterCard';
import { ResendConfirmationCard } from '../components/ResendConfirmationCard';
import { ResetPasswordCard } from '../components/ResetPasswordCard';
import { CARDS } from '../shared/variables';

const LandingPage = () => {
  const [card, setCard] = useState(CARDS.LOGIN);
  const { search } = useLocation();
  const history = useHistory();

  useEffect(() => {
    const query = new URLSearchParams(search);
    const state = query.get('state');
    if (state) {
      setCard(state || CARDS.LOGIN);
    }
  }, [search]);

  const customNavigate = (card) => {
    setCard(card);
    history.push('/login');
  };

  const CurrentCard = useCallback(() => {
    switch (card) {
      case CARDS.REGISTER:
        return <RegisterCard navigate={customNavigate} />;

      case CARDS.FORGET_PASSWORD:
        return <ForgetPasswordCard navigate={customNavigate} />;

      case CARDS.RESEND_CONFIRMATION:
        return <ResendConfirmationCard navigate={customNavigate} />;

      case CARDS.CHECK_CONFIRMATION:
        return <CheckConfirmationCard navigate={customNavigate} />;

      case CARDS.RESET_PASSWORD:
        return <ResetPasswordCard navigate={customNavigate} />;

      case CARDS.LOGIN:
      default:
        return <LoginCard navigate={setCard} />;
    }
  }, [card]);

  return (
    <Grid
      container
      spacing={10}
      style={{
        height: 'calc(100vh - 64px)',
        flexGrow: 1,
        padding: 20,
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12} sm={10} md={8} lg={5} style={{ minWidth: 460 }}>
        <Box>
          <Typography variant="h2" gutterBottom>
            Get better today!
          </Typography>
          <Typography variant="h6" component="p" align="justify">
            PeerPreps a coding collaborative platform… dummy words to fill up
            the space… dummy words to fill up the space… dummy words to fill up
            the space… dummy words to fill up the space… dummy words to fill up
            the space… dummy words to fill up the space… dummy words to fill up
            the space… dummy words to fill up the space… dummy words to fill up
            the space… dummy words to fill up the space… dummy words to fill up
            the space… dummy words to fill up the space… dummy words to fill up
            the space…
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={10} md={8} lg={5}>
        <Paper
          style={{
            margin: 'auto',
            minHeight: 300,
            minWidth: 460,
            maxWidth: 500,
            padding: 20,
          }}
        >
          <CurrentCard />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LandingPage;
