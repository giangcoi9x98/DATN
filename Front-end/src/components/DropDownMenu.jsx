import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {},
}))(MenuItem);

export default function CustomizedMenus(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const  [icon, setIcon] = useState(props.icon)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    setIcon(props.icon)
  }, [props.icon]);
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(icon);
  const renderIcon = () => {
    if (icon == 'mess') {
      return<MailIcon></MailIcon>
    }
    return <NotificationsIcon></NotificationsIcon>
  }
  return (
    <div>
      <IconButton
        aria-controls='customized-menu'
        aria-haspopup='true'
        variant='contained'
        color='primary'
        onClick={handleClick}
      >
       {renderIcon()}
      </IconButton>
      <StyledMenu
        id='customized-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <ListItemIcon>
            <SendIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Sent mail' />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <DraftsIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Drafts' />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <InboxIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Inbox' />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}
