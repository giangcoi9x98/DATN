import React, { memo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Divider, Grid, Box } from '@material-ui/core';
import { COLORS } from '../../constants';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import NewPost from '../../components/NewPost';
import Post from '../../components/Post';
import { withRouter } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Contacts from '../../components/Contacts';
import Suggested from '../../components/Suggested';
import BubbleChat from '../../components/BubbleChat';
import _ from 'lodash';

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

const Home = memo((props) => {
  const { t, i18n } = useTranslation('common');
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.post);
  const contacts = useSelector((state) => state.contact);
  const classes = useStyle();
  const isAuth = useAuth();
  if (!isAuth) {
    props.history.push('/login');
  }
  useEffect(() => {
    if (!isAuth) {
      window.location = '/login';
    }
  }, [isAuth, props.history]);
  const renderPost = useCallback(() => {
    if (posts.postData) {
      return posts.postData.map((post) => {
        //if(user.id === post)
        return (
          <Post post={post.post} key={post.post.id} user={user.userData}></Post>
        );
      });
    } else {
      return <div></div>;
    }
  }, [posts.postData, user]);
  console.log('posts :>> ', posts);
  contacts?.allContact?.sort((a, b) => {
    return b?.contact?.messages?.length - a?.contact?.messages?.length;
  });
  const renderContacts = useCallback(() => {
    if (contacts.allContact) {
      return contacts.allContact.map((contact) => {
        return <Contacts contact={contact} key={contact.contact.id}></Contacts>;
      });
    } else {
      return <div></div>;
    }
  }, [contacts.allContact]);
  const renderChat = () => {
    if (contacts.allContact) {
      return contacts.allContact.map((contact) => {
        let isShow = false;
        contacts?.isSelected?.map((e) => {
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
              message={_.sortBy(
                contact.contact.messages,
                (e) => Date.parse(e?.detail?.create_at),
                ['asc']
              )}
              contact={contact.contact}
            ></BubbleChat>
          </Box>
        );
      });
    } else {
      return <div></div>;
    }
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
});

export default withRouter(Home);
