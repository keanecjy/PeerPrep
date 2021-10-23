import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Avatar, Icon, Menu, MenuItem } from '@material-ui/core';

import { UserContext } from '../context/UserContext';
import theme from '../theme';
import { logout } from '../services/auth';

export const HeaderBar = () => {
  const { user } = useContext(UserContext);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHome = () => {
    history.push('/home');
    setAnchorEl(null);
    return;
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    history.push('/login');
    return;
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Toolbar>
        <Icon
          edge="start"
          style={{ marginRight: theme.spacing(2) }}
          color="secondary"
          aria-label="menu"
        >
          <MenuIcon />
        </Icon>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          PeerPrep
        </Typography>
        {user && (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleMenu}
            >
              <Avatar
                alt={user?.name || 'Guest User'}
                src={
                  user?.photo ||
                  `https://avatars.dicebear.com/api/gridy/${user.id}.svg`
                }
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              disablePortal={true}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleHome}>Dashboard</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </div>
  );
};
