import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../images/logo1.png';

const drawerWidth = 240;
const navItems = [
  { text: 'Dashboard', path: '/dashboard', requiresAuth: true },
  { text: 'Logout', path: '/', requiresAuth: false },
];

function Navbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:576px)');
  const navigate = useNavigate();
  const userid = localStorage.getItem('userid');
  const roleid = localStorage.getItem('roleid');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleHomeClick = () => {
    if (roleid === '1') {
      navigate('/userHome');
    } else if (roleid === '2') {
      navigate('/agencyHome');
    }
    else if (roleid === '3') {
      navigate('/adminHome')
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <img src={logo} alt="Logo" style={{ width: '50%', marginTop: '20px', marginBottom: '20px' }} />
      <Divider />
      <List>
        {userid && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleHomeClick} sx={{ textAlign: 'center' }}>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
        )}
        {navItems.map((item) => {
          if (item.requiresAuth && !userid) {
            return null;
          }
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={item.text === 'Logout' ? 'button' : Link}
                to={item.text === 'Logout' ? undefined : item.path}
                onClick={item.text === 'Logout' ? handleLogout : undefined}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: '#fff' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon sx={{ color: '#000' }} />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            <img src={logo} alt="Logo" style={{ height: '50px' }} />
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {userid && (
              <Button onClick={handleHomeClick} sx={{ color: '#000' }}>
                Home
              </Button>
            )}
            {navItems.map((item) => {
              if (item.requiresAuth && !userid) {
                return null;
              }
              return (
                <Button
                  key={item.text}
                  component={item.text === 'Logout' ? 'button' : Link}
                  to={item.text === 'Logout' ? undefined : item.path}
                  onClick={item.text === 'Logout' ? handleLogout : undefined}
                  sx={{ color: '#000' }}
                >
                  {item.text}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
