import React, { useEffect, memo } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import { Avatar, MenuItem } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SIZETYPE } from '../constants';
import { Container } from '@material-ui/core';
import api from '../api';
import { withRouter } from 'react-router';
import DropDownMenu from './DropDownMenu';
import NotiPostInteractive from './NotiPostInteractive';
import { useAuth } from '../hooks/useAuth';
import { getChatHistory } from '../store/actions/chatAction';
import { useState } from 'react';
import SettingModal from '../components/SettingModal';
import ResultSearch from '../components/ResultSearch';
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
      marginLeft: '4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
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

const PrimarySearchAppBar = memo((props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const { t, i18n } = useTranslation('common');
  const lang = useSelector((state) => state.lang);
  const { user } = useSelector((state) => state);
  const isAuth = useAuth();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState('');
  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [rsSearch, setRsSearch] = useState([]);
  let email;
  if (user) {
    email = user?.userData?.email;
  }
  useEffect(() => {
    if (isAuth) {
      async function fetchData() {
        await dispatch(getChatHistory());
      }
      fetchData();
    }
    return i18n.changeLanguage(lang.lang);
  }, [lang, i18n, dispatch, isAuth]);
  const contacts = useSelector((state) => state.contact.allContact);
  const posts = useSelector((state) => state.post.postData);
  useEffect(() => {
    const arrSearchContact = contacts?.filter((e) =>
      e?.contact?.fullname.includes(keyword)
    );
    const arrSearch = posts?.filter((e) =>
      e?.post?.content.includes(keyword)
    );
    arrSearchContact?.forEach((e) => {
      arrSearch?.push(e);
    });
    setRsSearch(arrSearch);
  }, [contacts, posts, keyword]);
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
      <SettingModal
        showModal={openModalSetting}
        onClose={() => setOpenModalSetting(false)}
      />
      <MenuItem
        onClick={() => {
          props.history.push(`/profile/${email.slice(0, email.length - 10)}`);
        }}
      >
        {t('navBar.profile')}
      </MenuItem>
      <MenuItem
        onClick={() => {
          setOpenModalSetting(true);
          handleMenuClose();
        }}
      >
        {t('navBar.setting')}
      </MenuItem>
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
        <DropDownMenu icon={'mess'}></DropDownMenu>
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
            <div
              className={classes.leftNav}
              style={{
                position: 'relative',
              }}
            >
              <Avatar src='/Guiang.svg' />
              <div className={classes.title} variant='h6'>
                Codeses
              </div>
              <ResultSearch rsSearch={rsSearch} keyword={keyword} />
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
                  onChange={(e) => setKeyword(e.target.value)}
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
                <DropDownMenu icon='mess'></DropDownMenu>
                {/* <IconButton
                  aria-label='show 17 new notifications'
                  color='inherit'
                >
                  <Badge badgeContent={17} color='secondary'>
                    <NotificationsIcon className={classes.icon} />
                  </Badge>
                </IconButton> */}
                <NotiPostInteractive></NotiPostInteractive>
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
});

export default withRouter(PrimarySearchAppBar);
