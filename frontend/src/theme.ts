import { createTheme } from '@material-ui/core/styles';

export const styles = {
  BLUE: '#1976D2',
  LIGHT_BLUE: '#338FED',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
};

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          background: `linear-gradient(45deg, ${styles.BLUE} 10%, ${styles.LIGHT_BLUE} 100%)`,
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        },
      },
    },
  },
  palette: {
    type: 'light',
    primary: {
      main: styles.BLUE,
      light: styles.LIGHT_BLUE,
    },
    secondary: {
      main: '#f2f3f5',
    },
  },
  typography: {
    h1: {
      color: styles.WHITE,
    },
  },
});

export default theme;
