import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Suggested = memo(() => {
  const classes = useStyles();

  return (
    <List dense className={classes.root}>
      {[
        {
          name: 'John',
          avatar: '/img/faces/card-profile1-square.jpg',
        },
        {
          name: 'Hanna',
          avatar: '/img/faces/card-profile2-square.jpg',
        },
        {
          name: 'Justin',
          avatar: '/img/faces/card-profile4-square.jpg',
        },
        {
          name: 'Thomas',
          avatar: '/img/faces/card-profile5-square.jpg',
        },
      ].map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem key={value} button>
            <ListItemAvatar>
              <Avatar alt={`Avatar n°${value + 1}`} src={value?.avatar} />
            </ListItemAvatar>
            <ListItemText id={labelId} primary={` ${value?.name}`} />
          </ListItem>
        );
      })}
    </List>
  );
})

export default Suggested
