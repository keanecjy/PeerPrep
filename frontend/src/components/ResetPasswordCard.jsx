import { useLocation } from 'react-router';
import { useLayoutEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded';

import theme from '../theme';
import { PasswordTextField } from './PasswordTextField';
import { processPasswordReset } from '../services/auth';
import { LoadingIndicator } from './LoadingIndicator';
import { CARDS } from '../shared/variables';
import { HighlightedText } from './HighlightedText';

const validationSchema = yup.object({
  // checks according to OWASP password policy
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .matches(
      /^(?=.*[~`!@#$%^&*+=\-\[\]\\';,/{}|":<>?()._])/,
      'Password should contain at least one special character'
    )
    .matches(/^(?=.*[0-9])/, 'Password should contain at least one number')
    .matches(
      /^(?=.*[a-z])/,
      'Password should contain at least one lowercase letter'
    )
    .matches(
      /^(?=.*[A-Z])/,
      'Password should contain at least one uppercase letter'
    )
    .required('Password is required'),
  confirm: yup
    .string('Confirm your new password')
    .oneOf([yup.ref('password'), null], 'Password does not match'),
});

export const ResetPasswordCard = ({ navigate }) => {
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(null);
  const { search } = useLocation();

  useLayoutEffect(() => {
    const query = new URLSearchParams(search);
    const token = query.get('token');
    setToken(token);
  }, []);

  const handleSubmit = async ({ password }, { setSubmitting, setErrors }) => {
    await processPasswordReset(token, password)
      .then(() => {
        setTimeout(() => {
          setSubmitting(false);
          setSuccess(true);
        }, 150);
      })
      .catch((error) => {
        setSubmitting(false);
        setErrors({
          password: ' ',
          confirm:
            error.response?.data?.message ||
            'Invalid password reset link. Please request for a new reset link.',
        });
      });
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm: '',
    },
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
            RESET YOUR PASSWORD
          </Typography>
        </Grid>
        <Grid item xs>
          {token ? (
            <>
              <PasswordTextField
                required
                fullWidth
                variant="outlined"
                id="password"
                name="password"
                label="New Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={
                  (formik.touched.password &&
                    formik.errors.password !== ' ' &&
                    formik.errors.password) ||
                  ' '
                }
                autoComplete="off"
              />
              <PasswordTextField
                required
                fullWidth
                variant="outlined"
                id="confirm"
                name="confirm"
                label="Confirm New Password"
                type="password"
                value={formik.values.confirm}
                onChange={formik.handleChange}
                error={formik.touched.confirm && Boolean(formik.errors.confirm)}
                helperText={
                  (formik.touched.confirm && formik.errors.confirm) || ' '
                }
                autoComplete="off"
              />
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <ErrorOutlineRoundedIcon
                fontSize="inherit"
                style={{ width: 150, height: 150, color: '#C62828' }}
              />
              <HighlightedText center>Missing Token</HighlightedText>
            </Box>
          )}

          {success && (
            <HighlightedText>
              Password reset successful. You may proceed to login with your new
              password
            </HighlightedText>
          )}
        </Grid>
        <Grid item xs style={{ textAlign: 'center' }}>
          {token && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={success || formik.isSubmitting || formik.isValidating}
              size="large"
            >
              Reset Password
              {(formik.isSubmitting || formik.isValidating) && (
                <LoadingIndicator />
              )}
            </Button>
          )}
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
