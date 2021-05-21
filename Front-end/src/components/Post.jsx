import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import config from '../configs';
import { Box, Input } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '600px',
    marginTop: '40px',
  },
  media: {
    // 56 . 25
    paddingTop: '100%',
    backgroundPosition: 'center'
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
}));

export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const { user, post } = props;
  const [images, setImages] = useState(props.post.post.files);
  const items = [
    { url:  `${config.BASE_URL}/giangcoi9x98@gmail.com/Rectangle 572.png` },
    { url:`${config.BASE_URL}/giangcoi9x98@gmail.com/Rectangle 573.png` },
    { url: `${config.BASE_URL}/giangcoi9x98@gmail.com/Rectangle 574.png` },

  ];
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  //let url = config.BASE_URL + post.post.files[0].path;
  //console.log('object', url);
  useEffect(() => {
    setImages(props.post.post.files);
  }, [props]);
  return (
    <Box boxShadow={3} className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label='recipe' className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label='settings'>
            <MoreVertIcon />
          </IconButton>
        }
        title='Shrimp and Chorizo Paella'
        subheader='September 14, 2016'
      />

      <Carousel autoPlay={false}  >{
        items.map(e => <CardMedia
          className={classes.media}
          title='Paella dish'
          src={e.url}
          image={`${e.url}`}
        />)
      }</Carousel>
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label='add to favorites'>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label='share'>
          <ShareIcon />
        </IconButton>
        <div style={{ marginLeft: "auto" }}
          onClick={handleExpandClick}
        >
          <p style={{ color: " rgba(0, 0, 0, 0.54)", cursor: "pointer" }}> 3 Comments </p>
        </div>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <Typography paragraph>
            <div style={{ display: "flex",  }}>
              <div style={{ width: "40px", height: "40px", marginRight:"10px" }}>
                <img style={{borderRadius:"50%", backgroundSize:"cover", width:"40px", height:"40px"}} src="img\profile-bg.jpg" alt="" />
              </div>
              <div style={{ paddingLeft: "10px", width: "100%" , backgroundColor:"#f0f2f5", borderRadius:"15px"}}>
                <p style={{ padding: "0px", margin: "0px" }}> Giang Tran </p>
                <p style={{ fontSize: "13px", color: " rgba(0, 0, 0, 0.54)", padding: "0px", margin: "0px" }}> This impressive paella is a perfect party dish and a fun meal to  </p>
                <span style={{ fontSize: "13px" }}> Thich </span>
                <span style={{ fontSize: "13px", paddingLeft: "10px" }}> Trả lời</span>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "10px", marginLeft: "40px", marginTop: "10px" }}>
              <div style={{ width: "25px", height: "25px" }}>
                  <img style={{borderRadius:"50%", backgroundSize:"cover", width:"25px", height:"25px"}} src="img\instagram.png" alt="" />
              </div>
              <div style={{ paddingLeft: "10px", width: "100%",  backgroundColor:"#f0f2f5", borderRadius:"15px" }}>
                <p style={{ padding: "0px", margin: "0px", fontSize: "13px" }}> Giang Tran </p>
                <p style={{ fontSize: "13px", color: " rgba(0, 0, 0, 0.54)" }}> Xin chao moi ng  </p>
              </div>
            </div>
          </Typography>
          <Typography paragraph>
            <div style={{ display: "flex", }}>
              <div style={{ width: "40px", height: "40px", marginRight:"10px" }}>
                <img style={{borderRadius:"50%", backgroundSize:"cover", width:"40px", height:"40px"}} src="img\bg.jpg" alt="" />
              </div>
              <div style={{ paddingLeft: "10px", width: "100%",  backgroundColor:"#f0f2f5", borderRadius:"15px" }}>
                <p style={{ padding: "0px", margin: "0px" }}> Giang Tran </p>
                <p style={{ fontSize: "13px", color: " rgba(0, 0, 0, 0.54)", padding: "0px", margin: "0px" }}> Add 1 cup of frozen peas along with the mussels, if you like.  </p>
                <span style={{ fontSize: "13px" }}> Thich </span>
                <span style={{ fontSize: "13px", paddingLeft: "10px" }}> Trả lời</span>
              </div>
            </div>
            
          </Typography>
          <Typography>
            <PhotoCameraIcon style={{ marginRight: "10px" }} />
            <Input style={{ width: "400px" }} placeholder="comments" />
            <span style={{ marginLeft: "20px" }}> Đăng </span>
          </Typography>
        </CardContent>
      </Collapse>
    </Box>
  );
}
