import React, { useCallback, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../socket';
import Badge from '@material-ui/core/Badge';
import { formatDate } from '../utils/formatDate';

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

export default function DropDownMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [icon, setIcon] = useState(props.icon);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [countChatHistory, setCountHistory] = useState([]);
  const chatHistory = useSelector((state) => state.chat);
  const [history, setHistory] = useState([]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    setHistory(chatHistory.history);
  }, [chatHistory.history]);

  useEffect(() => {
    socket.getInstance().on('NEW_CHAT_HISTORY', async (data) => {
      console.log('data :>> ', data);
      if (data.roomId === user.userData.id) {
        console.log('object', typeof history);
        const newHistory = [
          ...history.filter((e) => e.contactData.id !== data.sender.id),
        ];
        newHistory.unshift({
          contactData: data.sender,
          message: {
            content: data.message,
          },
          update_at: formatDate(Date.now()),
        });
        console.log('newHistor :>> ', newHistory);
        await setHistory(newHistory);
      }
    });
  }, [history, user.userData]);

  useEffect(() => {
    setIcon(props.icon);
    socket.getInstance().on('NEW_CHAT_HISTORY', async (data) => {
      console.log('data :>> ', data);
      if (data.roomId === user.userData.id) {
        setCountHistory([
          ...countChatHistory.filter((item) => item !== data.sender.accountId),
          data.sender.accountId,
        ]);
      }
    });
  }, [props.icon, countChatHistory, user.userData]);
  const handleClose = () => {
    setAnchorEl(null);
    setCountHistory([]);
  };

  const renderChatHistory = useCallback(() => {
    if (history.length) {
      return history.map((e) => {
        return (
          <StyledMenuItem style={{ height: '72px', width: '400px' }} key={e.id}>
            <ListItemIcon style={{ width: '50px', height: '50px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  position: 'absolute',
                  top: '68%',
                  left: '13%',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#31a24c',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                  }}
                >
                  {' '}
                </div>
              </div>
              <img
                style={{
                  borderRadius: '50%',
                  backgroundSize: 'cover',
                  width: '50px',
                  height: '50px',
                }}
                src='img\profile-bg.jpg'
                alt=''
              />
            </ListItemIcon>
            <div style={{ marginTop: '2px', marginLeft: '7px' }}>
              <p
                style={{
                  margin: '0px',
                  padding: '0px',
                  fontSize: '17px',
                  color: '#050505',
                }}
              >
                {e.contactData.fullname}
              </p>
              <p
                style={{
                  margin: '0px',
                  padding: '0px',
                  fontSize: '13px',
                  color: '#9a9b9d',
                }}
              >
                {e?.message?.content}
              </p>
            </div>
          </StyledMenuItem>
        );
      });
    } else {
      return <div></div>;
    }
  }, [history]);
  const renderIcon = () => {
    if (icon == 'mess') {
      return (
        <Badge badgeContent={countChatHistory.length}>
          <MailIcon style={{ color: 'white' }} />
        </Badge>
      );
    }
    return <NotificationsIcon style={{ color: 'white' }}></NotificationsIcon>;
  };

  return (
    <div>
      <IconButton
        style={{ marginTop: '4px' }}
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
        {renderChatHistory()}
      </StyledMenu>
    </div>
  );
}
