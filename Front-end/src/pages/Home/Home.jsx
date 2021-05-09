import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Container, Typography } from '@material-ui/core';
import { COLORS, SIZETYPE } from '../../constants';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import noti from '../../components/Notification';
import api from '../../api';
import { getProfileAction } from '../../store/actions/userAction';
import { fetchAllPost } from '../../store/actions/postAction';
import NewPost from '../../components/NewPost';
import Post from '../../components/Post';
import { withRouter } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyle = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.background_gradiant,
    width: '100%',
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
}));

function Home(props) {
  const { t, i18n } = useTranslation('common');
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [pendingReq, setPendingReq] = useState(true);
  const classes = useStyle();
  const isAuth = useAuth;
  if (!isAuth()) {
    props.history.push('/login');
  }
  useEffect(() => {
    async function fetchDataUser() {
      await dispatch(getProfileAction());
    }
    async function fetchDataPost() {
      await dispatch(fetchAllPost());
    }
    if (useAuth) {
      fetchDataUser();
      fetchDataPost();
    } else {
      props.history.push('/login');
    }
  }, [dispatch, props.history]);
  console.log('datapost', posts);
  const renderPost = () => {
    if (posts.postData) {
      return posts.postData.map((post) => {
        return <Post post={post}></Post>;
      });
    } else {
      return <div></div>;
    }
  };
  return (
    <Container component='main' maxWidth='md' className={classes.container}>
      <NewPost user={user}></NewPost>
      {renderPost()}
    </Container>
  );
}

export default withRouter(Home);
