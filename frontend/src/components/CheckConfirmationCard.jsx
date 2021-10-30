import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded';

import theme from '../theme';
import { verifyEmailConfirmation } from '../services/auth';
import { CARDS } from '../shared/variables';
import { useLocation } from 'react-router';
import { HighlightedText } from './HighlightedText';

export const CheckConfirmationCard = ({ navigate }) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(search);
    const token = query.get('token');
    if (!token) {
      setTimeout(() => {
        setLoading(false);
        setSuccess(false);
      }, 500);
      return;
    }
    console.log(success);
    checkToken(token);
  }, []);

  const checkToken = async (token) => {
    await verifyEmailConfirmation(token)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
        }, 150);
      })
      .catch((error) => {
        console.log(error)
        setLoading(false);
        setSuccess(false);
      });
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs>
        <Typography
          variant="h5"
          align="center"
          color="primary"
          style={{ fontWeight: 'bold' }}
        >
          EMAIL VERIFICATION
        </Typography>
      </Grid>
      <Grid item xs>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <CircularProgress
                size={50}
                thickness={5}
                style={{ margin: '50px 0px 20px 0px' }}
              />
              <Typography>Verifying your email...</Typography>
            </Box>
          ) : success ? (
            <>
              <CheckCircleOutlineRoundedIcon
                fontSize="inherit"
                style={{ width: 150, height: 150, color: '#558B2F' }}
              />
              <Typography>Account successfully activated!</Typography>
            </>
          ) : (
            <>
              <ErrorOutlineRoundedIcon
                fontSize="inherit"
                style={{ width: 150, height: 150, color: '#C62828' }}
              />
              <Typography style={{ paddingBottom: theme.spacing(1) }}>
                Invalid link!
              </Typography>
              <HighlightedText center>
                Verification link could be expired, please request for a new
                link
              </HighlightedText>
            </>
          )}
        </Box>
      </Grid>
      <Grid item xs style={{ textAlign: 'center' }}>
        {!success && !loading ? (
          <Button
            color="primary"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate(CARDS.RESEND_CONFIRMATION)}
            style={{
              marginTop: theme.spacing(1),
              marginBottom: theme.spacing(1),
            }}
          >
            Resend confirmation mail
          </Button>
        ) : (
          <Button
            color="primary"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            onClick={() => navigate(CARDS.LOGIN)}
            style={{
              marginTop: theme.spacing(1),
              marginBottom: theme.spacing(1),
            }}
          >
            Proceed to login
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
