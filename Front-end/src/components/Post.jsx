import React, { useState, useEffect, useCallback, memo } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import config from '../configs';
import { useTranslation } from 'react-i18next';
import SendIcon from '@material-ui/icons/Send';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Box, Input, Tooltip, Text } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import TelegramIcon from '@material-ui/icons/Telegram';
import { withRouter } from 'react-router-dom';
import api from '../api';
import Comment from './Comment';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '600px',
    marginTop: '40px',
    cursor: 'pointer',
  },
  media: {
    // 56 . 25
    paddingTop: '100%',
    backgroundPosition: 'center',
    // 16:9
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
  center: {},
  },
}));
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxSPadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip);

const Post = memo((props) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation('common');
  const [expanded, setExpanded] = React.useState(false);
  const { user, post } = props;
  const [images, setImages] = useState(post.files);
  const [content, setContent] = useState('');
  const [totalLike, setTotalLike] = useState(null);
  const [liked, setLiked] = useState(false);
  const [totalComment, setTotalComment] = useState(null);
  const [colorLike, setColorLike] = useState('rgba(0, 0, 0, 0.54)');
  const [comments, setComments] = useState([]);
  const items = [
    { url: `/img/bg.jpg` },
    { url: '/img/bg2.jpg' },
    { url: `${config.BASE_URL}/giangcoi9x98@gmail.com/Rectangle 574.png` },
  ];
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const redirectToDetailPost = (id) => {
    props.history.push(`/post/${id}`);
  };
  const likePost = async (postId) => {
    const res = await api.post.likePost(postId);
    if (res.status) {
      if (liked) {
        setLiked(false);
        setTotalLike(totalLike - 1);
        setColorLike('rgba(0, 0, 0, 0.54)');
      } else {
        setLiked(true);
        setTotalLike(totalLike + 1);
        setColorLike('red');
      }
    }
  };
  console.log('user', liked, post.id, post);
  const addComment = async (postId, content, img = '') => {
    const res = await api.post.addComment(postId, content, img);
    if (res) {
      setComments([
        {
          content: content,
          update_at: Date.now(),
          detailUserComment: user.userData,
        },
        ...comments,
      ]);

      setContent('');
    }
  };
  useEffect(() => {
    post?.likes &&
      post.likes.forEach((e) => {
        if (e?.detailUserLike.accountId == user?.accountId) {
          console.log('object :>> ', e?.detailUserLike);
          setLiked(true);
        } else {
          setLiked(false);
        }
      });
  }, [post, user]);
  useEffect(() => {
    setTotalLike(post?.totalLike);
    setTotalComment(post?.totalComment);
    setImages(post?.files);
    setComments(post?.comments);
  }, [post]);
  //render element
  const renderComment = useCallback(() => {
    if (comments?.length) {
      return comments?.map((e) => {
        return <Comment key={e.id} comment={e}></Comment>;
      });
    }
    return <div></div>;
  }, [comments]);
  return (
    <Box boxShadow={3} className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            className={classes.avatar}
            src={post?.detailUserPost?.avatar}
          />
        }
        action={
          <IconButton aria-label='settings' onClick={console.log('clicked')}>
            <MoreVertIcon />
          </IconButton>
        }
        title={post?.detailUserPost?.fullname}
        subheader={
          <Box onClick={() => redirectToDetailPost(post?.id)}>
            {moment(post?.creat_at).format('MMMM Do YYYY, h:mm:ss a')}
          </Box>
        }
      />

      <Carousel
        autoPlay={false}
        NextIcon={<ArrowForwardIosIcon style={{ color: 'white' }} />}
        PrevIcon={<ArrowBackIosIcon style={{ color: 'white' }} />}
        navButtonsProps={{
          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
          style: {
            backgroundColor: '#9c8b8b',
          },
        }}
        indicatorIconButtonProps={{
          style: {
            padding: '5px', // 1
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            backgroundColor: ' rgb(239 236 239)',
          },
        }}
      >
        {items.map((e) => (
          <CardMedia
            key={e.url}
            className={classes.media}
            title='Paella dish'
            src={e.url}
            image={`${e.url}`}
          />
        ))}
      </Carousel>
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
          {post?.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <LightTooltip title={t('post.like')} placeholder='left'>
          <div className={classes.center}>
            {totalLike > 0 ? totalLike : ''}
            <IconButton
              style={{
                color: liked ? 'red' : '',
              }}
              aria-label='add to favorites'
              onClick={() => likePost(post?.id)}
            >
              <FavoriteIcon />
            </IconButton>
          </div>
        </LightTooltip>
        <LightTooltip title={t('post.share')} placeholder='top'>
          <IconButton aria-label='share'>
            <TelegramIcon />
          </IconButton>
        </LightTooltip>
        <div style={{ marginLeft: 'auto' }} onClick={handleExpandClick}>
          <p style={{ color: ' rgba(0, 0, 0, 0.54)', cursor: 'pointer' }}>
            {totalComment ? totalComment + ' comments' : 'comment'}
          </p>
        </div>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <div>{renderComment()}</div>

          <div>
            <PhotoCameraIcon style={{ marginRight: '10px' }} />
            <Input
              style={{ width: '400px' }}
              placeholder='comments'
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  console.log('comment');
                }
              }}
            />
            <IconButton disabled={content ? false : true}>
              <SendIcon
                color='primary'
                onClick={() => addComment(post.id, content)}
              ></SendIcon>
            </IconButton>
          </div>
        </CardContent>
      </Collapse>
    </Box>
  );
})

export default withRouter(Post);
