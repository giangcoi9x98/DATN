import React, { useEffect, memo } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { COLORS } from '../constants';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  typo: {
    fontSize: '12px',
    fontFamily: 'none',
    color: COLORS.hidden_text,
  },
  titleFooter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    color: COLORS.hidden_text,
    fontSize: '16px',
  },
}));

const Footer = memo((props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const { t, i18n } = useTranslation('common');
  const lang = useSelector((state) => state.lang);
  const dispatch = useDispatch();
  useEffect(() => {
    async function updateLanguage() {
      await i18n.changeLanguage(lang.lang);
    }
    updateLanguage()
  }, [lang, i18n]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <div className={classes.titleFooter}>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
        >
          <Typography className={classes.typo}>
            {' '}
            {lang.lang == 'en' ? 'English' : 'Tiếng Việt'}
          </Typography>
          <ExpandMoreIcon className={classes.moreIcon} />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id='menu-list-grow'
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      onClick={() => {
                        dispatch({
                          type: 'LANGUAGE_CHANGE',
                          payload: 'en',
                        });
                        window.location = `${props.props.location.pathname}`;
                      }}
                    >
                      English
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        dispatch({
                          type: 'LANGUAGE_CHANGE',
                          payload: 'vi',
                        });
                        window.location = `${props.props.location.pathname}`;
                      }}
                    >
                      Tiếng Việt
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Typography className={classes.typo}>
          © 2021 From Codese Withlove
        </Typography>
      </div>
    </div>
  );
})

export default Footer