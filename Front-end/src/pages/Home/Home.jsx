import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography } from '@material-ui/core';
import { COLORS, SIZETYPE } from '../../constants';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import noti from '../../components/Notification';
import api from '../../api';
import Alert from '@material-ui/lab/Alert';
import NewPost from '../../components/NewPost'
import Post from '../../components/Post'
import {withRouter} from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const useStyle = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.background_gradiant,
    width: '100%',
    height: '1000px',
  },

  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
 

}));

function Home(props) {
  const { t, i18n } = useTranslation('common');
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const classes = useStyle();
  const isAuth = useAuth;
  if (!isAuth()) {
    props.history.push("/login")
  }
 
  console.log("userGlobal",user);
  return (
    <Container component='main' maxWidth='md' className={classes.container}>
      <NewPost user={user} ></NewPost>
      <div>
        <Post user={user}></Post>
      </div>
    </Container>
  );
}

export default withRouter(Home);
