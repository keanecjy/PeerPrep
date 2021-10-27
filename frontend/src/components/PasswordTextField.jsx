import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

export const PasswordTextField = ({ ...rest }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      {...rest}
      type={isVisible ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Toggle password visibility"
              onClick={() => {
                setIsVisible(!isVisible);
              }}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    ></TextField>
  );
};
