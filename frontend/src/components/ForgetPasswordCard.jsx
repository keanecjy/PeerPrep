import { Typography, TextField, Button, Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../theme';
import { sendPasswordReset } from '../services/auth';
import { LoadingIndicator } from './LoadingIndicator';
import { CARDS } from '../shared/variables';
import { useState } from 'react';
import { HighlightedText } from './HighlightedText';

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
});

export const ForgetPasswordCard = ({ navigate }) => {
  const [sent, setSent] = useState(false);

  const handleSubmit = async ({ email }, { setSubmitting, setErrors }) => {
    await sendPasswordReset(email)
      .then(() => {
        setSubmitting(false);
        setSent(true);
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
        setSubmitting(false);
        setErrors({ email: 'Account does not exist' });
      });
  };

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <Typography
            variant="h5"
            align="center"
            color="primary"
            style={{
              fontWeight: 'bold',
            }}
          >
            FORGET PASSWORD
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography>
            Provide us your email and we will send you a password reset link
          </Typography>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={
              formik.touched.email &&
              formik.errors.email !== ' ' &&
              formik.errors.email
            }
          />
          {sent && (
            <HighlightedText>
              We have send an account activation mail to your email address.
            </HighlightedText>
          )}
        </Grid>
        <Grid item xs style={{ textAlign: 'center' }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={sent || formik.isSubmitting || formik.isValidating}
            size="large"
          >
            Send Password Reset Email
            {(formik.isSubmitting || formik.isValidating) && (
              <LoadingIndicator />
            )}
          </Button>
          <Button
            align="center"
            size="small"
            variant="text"
            color="primary"
            disableElevation={true}
            disableRipple={true}
            disabled={formik.isSubmitting || formik.isValidating}
            onClick={() => navigate(CARDS.LOGIN)}
            style={{
              marginTop: theme.spacing(1),
              marginBottom: theme.spacing(1),
            }}
          >
            Back to login
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
