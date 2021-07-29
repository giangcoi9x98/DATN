import React, { useCallback, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../socket';
import Badge from '@material-ui/core/Badge';
import { setHistoryPostInteractive } from '../store/actions/postAction';
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

export default function NotiPostInteractive(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const [countNotiPost, setCountNotiPost] = useState(0);
  const notiPost = useSelector((state) => state.post?.postNoti);
  const mypost = useSelector((state) => state.post?.myPosts);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  useEffect(() => {
    socket.getInstance().on('NEW_LIKE', async (data) => {
      mypost.forEach((e) => {
        if (e.post?.id === data?.postId) {
          if (data.newLike) {
            dispatch(setHistoryPostInteractive(data));
            setCountNotiPost(countNotiPost + 1);
          }
        }
      });
    });
  }, [mypost, dispatch, countNotiPost]);
  useEffect(() => {
    socket.getInstance().on('NEW_COMMENT', async (data) => {
      mypost.forEach((e) => {
        if (e.post?.id === data?.postId) {
          if (data) {
            data.type = 'comment'
            dispatch(setHistoryPostInteractive(data));
            setCountNotiPost(countNotiPost + 1);
          }
        }
      });
    });
  }, [mypost, dispatch, countNotiPost]);
  const handleClose = () => {
    setAnchorEl(null);
    setCountNotiPost([]);
  };

  const renderChatHistory = useCallback(() => {
    if (notiPost?.length) {
      return notiPost.map((e) => {
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
                {e?.post?.totalComment}
              </p>
              <p
                style={{
                  margin: '0px',
                  padding: '0px',
                  fontSize: '13px',
                  color: '#9a9b9d',
                }}
              >
                {e?.post?.content}
              </p>
            </div>
          </StyledMenuItem>
        );
      });
    } else {
      return <div></div>;
    }
  }, [notiPost]);
  const renderIcon = () => {
    return (
      <Badge badgeContent={countNotiPost ?? null} color='secondary'>
        <NotificationsIcon style={{ color: 'white' }}></NotificationsIcon>
      </Badge>
    );
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
