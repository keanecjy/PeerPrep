import { Typography, TextField, Button, Grid } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../theme';
import { PasswordTextField } from './PasswordTextField';
import { login as apiLogin } from '../services/auth';
import { LoadingIndicator } from './LoadingIndicator';

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    // .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

export const LoginCard = ({ status, setStatus }) => {
  const history = useHistory();

  const handleSubmit = async (
    { email, password },
    { setSubmitting, setErrors }
  ) => {
    setStatus(null);
    await apiLogin(email, password)
      .then(() => {
        setSubmitting(false);
        setTimeout(() => {
          setSubmitting(false);
          history.push('/home');
        }, 150);
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
        setSubmitting(false);
        setErrors({ email: ' ', password: 'Invalid login details' });
      });
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
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
            LOGIN
          </Typography>
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
            helperText={formik.touched.password && formik.errors.password}
            autoComplete="off"
          />
          {status === 'verificationEmailSend' && (
            <div
              style={{
                backgroundColor: 'rgba(253, 200, 69, .3)',
                border: '2px solid rgba(253, 200, 69, .5)',
                padding: '16px',
                borderRadius: '4px',
              }}
            >
              <Typography variant="body2">
                We have send instructions on how to reset your password to your
                email address
              </Typography>
            </div>
          )}
        </Grid>
        <Grid item xs style={{ textAlign: 'center' }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting || formik.isValidating}
            size="large"
          >
            Login
            {(formik.isSubmitting || formik.isValidating) && (
              <LoadingIndicator />
            )}
          </Button>
          <Button
            align="center"
            size="small"
            textAlign="center"
            variant="text"
            color="primary"
            disableElevation={true}
            disableRipple={true}
            disabled={formik.isSubmitting || formik.isValidating}
            onClick={() => setStatus('Change Password')}
            style={{
              marginTop: theme.spacing(1),
              marginBottom: theme.spacing(1),
            }}
          >
            Forgot Password?
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
