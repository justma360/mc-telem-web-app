import React, { memo } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

import ListItemIcon from '@mui/material/ListItemIcon';
import RawOnIcon from '@mui/icons-material/RawOn';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BookIcon from '@mui/icons-material/Book';

interface Props {
  open: boolean;
  handleToggleNavMenu: (open?: boolean) => void;
}

const Drawer = memo(({ open, handleToggleNavMenu }: Props): JSX.Element => {
  const pages = [
    {
      path: '/',
      name: 'Home',
      icon: <HomeIcon />,
    },
    {
      path: '/about',
      name: 'About',
      icon: <InfoIcon />,
    },
    {
      path: '/raw-data',
      name: 'Raw Data',
      icon: <RawOnIcon />,
    },
    {
      path: '/blog',
      name: 'Blog',
      icon: <BookIcon />,
    },
  ];

  const navigationBar = () => (
    // List of items in the navigation bar
    <Box role="presentation" onClick={() => handleToggleNavMenu()}>
      <List>
        {/* Maps the object JSON into its seperate pages */}
        {pages.map((page) => (
          <Link key={page.path} to={page.path}>
            {/* Changes the cusor to a point when hovering the buttons */}
            <ListItem style={{ cursor: 'pointer' }}>
              {/* Adds the icons and the names to the Drawer list */}
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      {/* Extra text below the links */}
      <List>
        <ListItem button key="text">
          <ListItemText primary="Designed by Justin Ma" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key="left">
        <SwipeableDrawer
          anchor="left"
          open={open}
          onClose={() => handleToggleNavMenu(false)}
          onOpen={() => handleToggleNavMenu(true)}
        >
          {navigationBar()}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
});

Drawer.displayName = 'Drawer';

export default Drawer;
