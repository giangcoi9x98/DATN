import React, { useEffect } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { COLORS, SIZETYPE } from '../constants';
import { Container } from '@material-ui/core';
import api from '../api';
import { withRouter } from 'react-router';
import DropDownMenu from './DropDownMenu';

const useStyles = makeStyles((theme) => ({
  grow: {
    width: '100%',
    position: 'fixed',
    zIndex: 10,
  },
  navBar: {
    background: COLORS.background_gradiant,
  },
  leftNav: {
    display: 'flex',
    marginRight: '10%',
  },
  rightNav: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  toolBar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '10px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: SIZETYPE.icon,
    height: SIZETYPE.icon,
  },
  homeIcon: {
    width: SIZETYPE.homeIcon,
    height: SIZETYPE.homeIcon,
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function PrimarySearchAppBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const { t, i18n } = useTranslation('common');
  const lang = useSelector((state) => state.lang);
  const { user } = useSelector((state) => state);
  let email;
  if (user) {
    email = user.userData.email;
  }
  useEffect(() => {
    return i18n.changeLanguage(lang.lang);
  }, [lang]);
  const handleLogout = async () => {
    const res = await api.auth.logOut();
    if (res.status) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      window.location = '/login';
    }
  };
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const messIcon = () => {
    return<MailIcon></MailIcon>
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          props.history.push(`/profile/${email.slice(0, email.length - 10)}`);
        }}
      >
        {t('navBar.profile')}
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>{t('navBar.setting')}</MenuItem>
      <MenuItem onClick={handleLogout}>{t('navBar.logout')}</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => props.history.push('/')}>
        <IconButton aria-label='show 4 new mails' color='inherit'>
          <HomeIcon></HomeIcon>
        </IconButton>
        <p>{t('navBar.home')}</p>
      </MenuItem>
      <MenuItem>
        {/* <IconButton aria-label='show 4 new mails' color='inherit'>
          <Badge badgeContent={4} color='secondary'>
            <MailIcon />
          </Badge>
        </IconButton> */}
        <DropDownMenu icon={"mess"}></DropDownMenu>
        <p>{t('navBar.message')}</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label='show 11 new notifications' color='inherit'>
          <Badge badgeContent={11} color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>{t('navBar.notification')}</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          props.history.push(`/profile/1`);
        }}
      >
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>{t('navBar.profile')}</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position='static' className={classes.navBar}>
        <Container maxWidth='lg' component='main'>
          <Toolbar className={classes.toolBar}>
            {/* 
           logo codese
            */}
            <div className={classes.leftNav}>
              <Typography className={classes.title} variant='h6' noWrap>
                Codeses
              </Typography>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder={`${t('navBar.search')}...`}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
              <div />
            </div>
            <div className={classes.rightNav}>
              <div className={classes.sectionDesktop}>
                <IconButton
                  color='inherit'
                  onClick={() => props.history.push('/')}
                >
                  <HomeIcon className={classes.homeIcon} />
                </IconButton>
                {/* <IconButton aria-label='show 4 new mails' color='inherit'>
                  <Badge badgeContent={4} color='secondary'>
                    <MailIcon className={classes.icon} />
                  </Badge>
                </IconButton> */}
                <DropDownMenu icon = "mess"></DropDownMenu>
                <IconButton
                  aria-label='show 17 new notifications'
                  color='inherit'
                >
                  <Badge badgeContent={17} color='secondary'>
                    <NotificationsIcon className={classes.icon} />
                  </Badge>
                </IconButton>
                <IconButton
                  edge='end'
                  aria-label='account of current user'
                  aria-controls={menuId}
                  aria-haspopup='true'
                  onClick={handleProfileMenuOpen}
                  color='inherit'
                >
                  <AccountCircle className={classes.icon} />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label='show more'
                  aria-controls={mobileMenuId}
                  aria-haspopup='true'
                  onClick={handleMobileMenuOpen}
                  color='inherit'
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
export default withRouter(PrimarySearchAppBar);
