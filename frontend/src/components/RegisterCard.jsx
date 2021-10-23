import { TextField, Button, Grid, Tab, Tabs } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../theme';
import { PasswordTextField } from './PasswordTextField';
import { login as apiLogin } from '../services/auth';
import { LoadingIndicator } from './LoadingIndicator';
import { CARDS } from '../shared/variables';
import { useState } from 'react';

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirm: yup
    .string('Confirm your password')
    .oneOf([yup.ref('password'), null], 'Password does not match'),
});

export const RegisterCard = ({ navigate }) => {
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (
    { email, password },
    { setSubmitting, setErrors }
  ) => {
    await apiLogin(email, password)
      .then(() => {
        setSubmitting(false);
        setRegistered(true);
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
        setSubmitting(false);
        setErrors({
          email: ' ',
          password: ' ',
          confirm: 'Invalid login details',
        });
      });
  };

  const formik = useFormik({
    initialValues: {
      email: '',
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
          <Tabs
            value={CARDS.REGISTER}
            onChange={(_event, newValue) => navigate(newValue)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="LOGIN" value={CARDS.LOGIN} />
            <Tab label="REGISTER" value={CARDS.REGISTER} />
          </Tabs>
        </Grid>
        <Grid item xs>
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
          <PasswordTextField
            required
            fullWidth
            variant="outlined"
            margin="normal"
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={
              formik.touched.password &&
              formik.errors.password !== ' ' &&
              formik.errors.password
            }
            autoComplete="off"
          />
          <PasswordTextField
            required
            fullWidth
            variant="outlined"
            margin="normal"
            id="confirm"
            name="confirm"
            label="Confirm Password"
            type="password"
            value={formik.values.confirm}
            onChange={formik.handleChange}
            error={formik.touched.confirm && Boolean(formik.errors.confirm)}
            helperText={formik.touched.confirm && formik.errors.confirm}
            autoComplete="off"
          />
          {registered && (
            <HighlightedText>
              We have send instructions on how to reset your password to your
              email address
            </HighlightedText>
          )}
        </Grid>
        <Grid item xs style={{ textAlign: 'center' }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={registered || formik.isSubmitting || formik.isValidating}
            size="large"
          >
            Register
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
            onClick={() => navigate(CARDS.RESEND_CONFIRMATION)}
            style={{
              marginTop: theme.spacing(1),
              marginBottom: theme.spacing(1),
            }}
          >
            Resend Email Confirmation
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
