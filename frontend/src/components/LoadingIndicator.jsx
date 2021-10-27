import React from 'react';
import { CircularProgress, Box } from '@material-ui/core';

export const LoadingIndicator = ({ size, classes }) => {
  return (
    <Box color="secondary.main" pl={1.5} display="flex">
      <CircularProgress
        size={size ? size : 24}
        thickness={size ? (size / 5) * 24 : 5}
        className={classes}
      />
    </Box>
  );
};
