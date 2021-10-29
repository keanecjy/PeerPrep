import { createTheme } from '@material-ui/core/styles';

export const styles = {
  BLUE: '#1976D2',
  LIGHT_BLUE: '#2D8FFF',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
};

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          background: `linear-gradient(to right, ${styles.BLUE} 20%, ${styles.LIGHT_BLUE} 100%)`,
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
    h2: {
      color: styles.WHITE,
    },
    h3: {
      color: styles.WHITE,
    },
    h4: {
      color: styles.WHITE,
    },
    h5: {
      color: styles.WHITE,
    },
    h6: {
      color: styles.BLUE,
    },
  },
});

export default theme;
