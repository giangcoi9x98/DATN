import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Container,
  Divider,
  Typography,
  Box,
  Grid,
} from '@material-ui/core';
import { COLORS, SIZETYPE } from '../../constants';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import noti from '../../components/Notification';
import api from '../../api';
import { getProfileAction } from '../../store/actions/userAction';
import { fetchAllPost } from '../../store/actions/postAction';
import { getContacts } from '../../store/actions/contactAction';
import NewPost from '../../components/NewPost';
import Post from '../../components/Post';
import { withRouter } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Contacts from '../../components/Contacts';
import Suggested from '../../components/Suggested';
import Chat from '../../components/Chat';
import socket from '../../socket';
import BubbleChat from '../../components/BubbleChat';
const useStyle = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: COLORS.background_gradiant,
    width: '74%',
    height: '100%',
  },

  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  loading: {
    display: 'flex',
    zIndex: 4,
  },
  opacity: {
    width: '100%',
    height: '100%',
    opacity: '0.5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  wrapContacts: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    height: '100%',
    flexDirection: 'column',
    width: '100%',
  },
  mess: {
    margin: theme.spacing.unit, // You might not need this now
    position: 'fixed',
    bottom: 0,
    right: theme.spacing.unit * 3,
    display: 'flex',
    zIndex: 5,
  },
}));

function Home(props) {
  const { t, i18n } = useTranslation('common');
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.post);
  const contacts = useSelector((state) => state.contact);
  const dispatch = useDispatch();
  const [pendingReq, setPendingReq] = useState(true);
  const classes = useStyle();
  const isAuth = useAuth();
  if (!isAuth) {
    props.history.push('/login');
  }
  useEffect(() => {
    if (isAuth) {
      async function fetchData() {
        await dispatch(getProfileAction());
       // await dispatch(fetchAllPost());
        await dispatch(getContacts());
      }
      fetchData();
    } else {
      props.history.push('/login');
    }
  }, [dispatch, isAuth]);
  const renderPost = () => {
    if (posts.postData) {
      return posts.postData.map((post) => {
        return <Post post={post}></Post>;
      });
    } else {
      return <div></div>;
    }
  };
  const renderContacts = useCallback(() => {
    if (contacts.contactData) {
      return contacts.contactData.map((contact) => {
        return <Contacts contact={contact}></Contacts>;
      });
    } else {
      return <div></div>;
    }
  }, [contacts.contactData]);
  const renderChat = () => {
    if (contacts.contactData) {
      return contacts.contactData.map((contact) => {
        let isShow = false;
        contacts.isSelected.map((e) => {
          if (e == contact.contact.id) isShow = true;
        });
        return (
          <Box
            className={classes.message}
            key={contact.contact.id}
            style={{
              display: isShow ? 'block' : 'none',
            }}
          >
            <BubbleChat
              message={contact.contact.messages}
              contact={contact.contact}
            ></BubbleChat>
          </Box>
        );
      });
    } else {
      return <div></div>;
    }
  };
  const click = () => {
    return <BubbleChat></BubbleChat>;
  };
  return (
    <Container component='main' maxWidth='lg' className={classes.container}>
      {/* //   <Container>
    //     <Button onClick = {() => click} > click</Button>
    //     {renderPost()}
    //   </Container>
    //   {/* <div className={classes.mess}>
    //     <BubbleChat></BubbleChat>
    //     <BubbleChat></BubbleChat>

    //   </div> */}
      {/* //   <Box className={classes.mess}>
    //     <Contacts></Contacts>
    //   </Box> */}{' '}
      <Grid container>
        <Grid item xs={12} sm={6}>
          <NewPost user={user}></NewPost>
        </Grid>
        <Grid item xs={12} sm={9}>
          {renderPost()}
        </Grid>
        <Grid item sx={12} sm={3}>
          <div
            style={{
              position: 'fixed',
              overflowY: 'scroll',
              height: '85%',
              width: '18%',
            }}
          >
            <Box className={classes.mess}>{renderChat()}</Box>
            <Suggested></Suggested>
            <Divider></Divider>
            {renderContacts()}
          </div>
        </Grid>
      </Grid>
      <Grid className={classes.mess}>{/* <BubbleChat></BubbleChat> */}</Grid>
    </Container>
  );
}

export default withRouter(Home);
