import React, {useState} from 'react';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import clsx from 'clsx';
import { Box } from '@material-ui/core';
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
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    maxHeight:445
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
}));
const theme = createMuiTheme({
  // palette: {
  //   primary: green,
  // },
});
export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [message, setMessage] = useState(props.message)
  console.log("messageComponent", message);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box className={classes.root} boxShadow={4} hidden={false}>
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
      <CardMedia
        className={classes.media}
        image='/static/images/cards/paella.jpg'
        title='Paella dish'
      />
      <CardContent>
      </CardContent>
      <CardActions disableSpacing>
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
        />
        <IconButton>
          <SendIcon color='primary'></SendIcon>
        </IconButton>
      </CardActions>
    </Box>
  );
}
