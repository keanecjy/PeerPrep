import { Grid, Typography, Paper } from '@material-ui/core';
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
      spacing={5}
      style={{ height: '100vh' }}
      // direction="column"
      alignItems="center"
      justifyContent="center"
    >
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
