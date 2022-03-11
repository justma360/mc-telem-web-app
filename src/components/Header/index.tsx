import React, { memo, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { IconButton, Stack, Typography, Menu } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Drawer from './components/Drawer/Drawer';
import HeaderStatusBar from './components/HeaderStatusBar/HeaderStatusBar';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export const Header = memo((): JSX.Element => {
  const [anchorElUser, setAnchorElUser] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleToggleNavMenu = (open?: boolean) => {
    // Left side links drawer
    setOpenDrawer(open === undefined ? !openDrawer : open);
  };

  const handleToggleUserMenu = () => {
    // Right side User profile on the
    setAnchorElUser(!anchorElUser);
  };

  return (
    <>
      <Drawer open={openDrawer} handleToggleNavMenu={handleToggleNavMenu} />
      <AppBar position="static">
        <Container className="header-container">
          <Toolbar disableGutters>
            {/* Button on the left for drawer */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
              <IconButton
                size="large"
                aria-label="drawer-access"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => handleToggleNavMenu(!openDrawer)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              {/* Naming / Logo Location  */}
              <Typography
                variant="h4"
                noWrap
                component="div"
                alignItems="center"
                sx={{ ml: 2, display: { xs: 'flex', md: 'flex' } }}
              >
                Motorcycle Telemetry
              </Typography>
            </Box>

            <HeaderStatusBar />

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleToggleUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Justin Ma" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              {/* Alignment of the user menu when opened */}
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={null} // Sets the achor position of the user menu
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted // stays there untill closed
                open={Boolean(anchorElUser)} // Opens when you click and shows menu
                onClose={handleToggleUserMenu} // Closes when you click away
              >
                {/* Maps the "settings" when opening the user profile */}
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleToggleUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
});

Header.displayName = 'Header';
export default Header;
