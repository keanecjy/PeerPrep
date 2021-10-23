import { Button, Menu } from '@material-ui/core';
import React, { useState } from 'react';
import SelectionItem from './SelectionItem';

const SelectionMenu = (props) => {
  const { header, list, value, setValue } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (item) => {
    setAnchorEl(null);
    setValue(item);
  };

  return (
    <div>
      <p>{header}</p>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {value}
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
          <SelectionItem handleClose={() => handleClose(item)} text={item} />
        ))}
      </Menu>
    </div>
  );
};

export default SelectionMenu;
