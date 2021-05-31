import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import api from '../../api';
import Post from '../../components/Post';
import { COLORS, SIZETYPE } from '../../constants';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Container,
  Divider,
  Typography,
  Box,
  Grid,
} from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: COLORS.background_gradiant,
    width: '74%',
    height: '100%',
  },
}));

function DetailPost(props) {
  const [post, setPost] = useState({});
  const classes = useStyle();

  useEffect(() => {
    async function fetchDataPostDetail(id) {
      const res = await api.post.getById(id);
      if (res?.status) {
        setPost(res.data.data);
      }
    }
    fetchDataPostDetail(props.location.pathname.split('/')[2]);
  }, [props.location.pathname]);

  return (
    <Container component='main' maxWidth='lg' className={classes.container}>
      <Grid container>
        <Grid item xs={12} sm={9}>
          <Post post={post}></Post>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withRouter(DetailPost);