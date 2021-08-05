import React, { useEffect, useState, memo } from 'react';
import { withRouter } from 'react-router-dom';
import api from '../../api';
import Post from '../../components/Post';
import { useSelector } from 'react-redux';
import { COLORS } from '../../constants';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
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

const DetailPost = memo((props) => {
  const [post, setPost] = useState({});
  const classes = useStyle();
  const user = useSelector((state) => state.user);

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
          <Post post={post}  user={user.userData}></Post>
        </Grid>
      </Grid>
    </Container>
  );
})

export default withRouter(DetailPost);
