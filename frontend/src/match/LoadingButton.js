import { Button, CircularProgress } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { useState } from 'react';

const LoadingButton = (props) => {
  const { loading, done, ...other } = props;

  if (done) {
    return (
      <Button {...other} disabled>
        <Check />
      </Button>
    );
  } else if (loading) {
    return (
      <Button {...other}>
        <CircularProgress />
      </Button>
    );
  } else {
    return <Button {...other}></Button>;
  }
};

export default LoadingButton;
