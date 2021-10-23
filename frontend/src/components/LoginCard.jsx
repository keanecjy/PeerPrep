import { TextField, Button, Grid, Tab, Tabs } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../theme';
import { PasswordTextField } from './PasswordTextField';
import { login as apiLogin } from '../services/auth';
import { LoadingIndicator } from './LoadingIndicator';
import { CARDS } from '../shared/variables';

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

export const LoginCard = ({ navigate }) => {
  const history = useHistory();

  const handleSubmit = async (
    { email, password },
    { setSubmitting, setErrors }
  ) => {
    await apiLogin(email, password)
      .then(() => {
        setTimeout(() => {
          setSubmitting(false);
          history.push('/home');
        }, 150);
      })
      .catch((error) => {
        setSubmitting(false);
        setErrors({
          email: ' ',
          password: error.response?.data?.message || 'Invalid login details',
        });
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
    <form onSubmit={formik.handleSubmit} noValidate>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <Tabs
            value={CARDS.LOGIN}
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
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={
              (formik.touched.email &&
                formik.errors.email !== ' ' &&
                formik.errors.email) ||
              ' '
            }
          />
          <PasswordTextField
            required
            fullWidth
            variant="outlined"
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            helperText={
              (formik.touched.password && formik.errors.password) || ' '
            }
            autoComplete="off"
          />
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
            variant="text"
            color="primary"
            disableElevation={true}
            disableRipple={true}
            disabled={formik.isSubmitting || formik.isValidating}
            onClick={() => navigate(CARDS.FORGET_PASSWORD)}
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
