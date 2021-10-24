import { Box, Button, Menu, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import SelectionItem from './SelectionItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const SelectionMenu = (props) => {
  const { header, list, value, setValue } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const setItem = (item) => {
    setValue(item);
  };

  return (
    <Box marginTop={4}>
      <Typography color="primary" style={{ fontWeight: 'bold' }}>
        {header}
      </Typography>
      <Button
        style={{
          marginTop: 4,
          minWidth: 200,
          justifyContent: 'space-between',
        }}
        id="basic-button"
        variant="contained"
        color="secondary"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {value}
        <KeyboardArrowDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {list.map((item) => (
          <SelectionItem handleClose={() => setItem(item)} text={item} />
        ))}
      </Menu>
    </Box>
  );
};

export default SelectionMenu;
