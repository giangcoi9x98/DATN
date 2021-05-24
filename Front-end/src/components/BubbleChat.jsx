import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';

import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { green, red } from '@material-ui/core/colors';
import { TextField } from '@material-ui/core';
import ShareIcon from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddFile from '../components/AddFile';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { deleteContactSelected } from '../store/actions/contactAction';
import { useDispatch, useSelector } from 'react-redux';
import { SIZETYPE } from '../constants';
import api from '../api';
import { newMessage, setHistoryChat } from '../store/actions/chatAction';
import socket from '../socket';
const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 345,
    maxHeight: 545,
    minHeight: 450,
    flexDirection: 'column',
    display: 'flex',
    backgroundColor: 'white',
    marginLeft:'10px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  listMess: {
    overflowY: 'scroll',
  },
  messageItem: {
    display: 'flex',
    flexDirection: 'row',
    cursor: 'pointer',
    padding: SIZETYPE.small,
    width:'100%'
  },
  wrapMessage: {
    overflow: 'scroll',
    maxHeight: 300,
    display: 'block',
  },
}));
const theme = createMuiTheme({
  // palette: {
  //   primary: green,
  // },
});
export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [expanded, setExpanded] = React.useState(false);
  const [contact, setContact] = useState(props.contact);
  const [message, setMessage] = useState(props.message) || [];
  const chatHistory = useSelector(state => state.chat)
  const [content, setContent] = useState('');
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  // console.log(message);
  useEffect(() => {
    socket.getInstance().on('NEW_MESSAGE', async (data) => {
      console.log('data :>> ', data);
      if (data.roomId == user.userData.id) {
        setMessage([
          ...message,
          {
            avatar:data.sender.avatar,
            detail: {
              content: data.message,
            },
          },
        ]);
        dispatch(setHistoryChat(
          {
            accountId: data.roomId,
            contactData: data.sender
          }
        ))
      }
      console.log(message);
    });
  }, [message, user.userData.id, setMessage]);
  const handlerSend = async (msg, roomId = contact.id) => {
    const res = await api.chat.send({
      message: msg,
      roomId: roomId,
    });
    socket.getInstance().emit('SEND_MESSAGE', {
      message: msg,
      roomId: roomId,
    });
    setMessage([
      ...message,
      {
        detail: {
          content: msg
        }
      }
    ])
    console.log(res);
  };
  const renderMessageItem = () => {
    if (message.length > 0) {
      return (
        <div className={classes.wrapMessage}>
          {message.map((value) => {
            //console.log(value);
            return (
              <div
                key={value}
                button
                className={classes.messageItem}
                style={{
                  justifyContent: value.receiverId == contact.id ? 'flex-end' : 'flex-start'
                }}
              >
                <Box style={{
                  display: 'flex',
                  flexDirection:'row'
                 
                }}>
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${value + 1}`}
                      src={`${
                        value.senderId == contact.id ? contact.avatar : value.avatar
                      }`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    id={value.detail? value.detail.id : 1}
                    primary={`${value.detail? value.detail.content : value.avatar}`}
                  />
                </Box>
              </div>
            );
          })}
        </div>
      );
    }
    return <div></div>;
  };
  return (
    <Box className={classes.root} boxShadow={4} hidden={false}>
      <Box boxShadow={4}>
        <CardHeader
          avatar={
            <Avatar
              aria-label='recipe'
              className={classes.avatar}
              src={contact.avatar}
            >
              R
            </Avatar>
          }
          action={
            <IconButton
              aria-label='settings'
              onClick={() => dispatch(deleteContactSelected(contact.id))}
            >
              <CloseIcon />
            </IconButton>
          }
          title={contact.fullname}
        />
      </Box>
      {renderMessageItem()}
      <Box
        style={{
          //justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '0px',
          margin: '0px',
          maxWidth:345
        }}
        boxShadow={3}
      >
        <AddFile
          buttonProps={{
            color: 'primary',
          }}
        ></AddFile>
        <TextField
          className={classes.margin}
          label='ThemeProvider'
          variant='outlined'
          id='mui-theme-provider-outlined-input'
          onChange={(e) => setContent(e.target.value)}
        />
        <IconButton onClick={() => handlerSend(content)}>
          <SendIcon color='primary'></SendIcon>
        </IconButton>
      </Box>
    </Box>
  );
}
