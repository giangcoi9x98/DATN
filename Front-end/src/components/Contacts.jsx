import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import { Avatar, Divider } from '@material-ui/core';
import BubbleChat from './BubbleChat';
import { useDispatch } from 'react-redux';
import {getContactsSelected} from '../store/actions/contactAction'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  mess: {
    margin: theme.spacing.unit, // You might not need this now
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
    display: 'flex',
    zIndex: 5,
  },
}));

export default function CheckboxListSecondary(props) {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [checked, setChecked] = React.useState([1]);
  const [contact, setContact] = useState(props.contact);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <div onClick ={() => dispatch(getContactsSelected(contact.contact.id))}>
      <List dense className={classes.root}>
        <ListItem button>
          <ListItemAvatar>
            <Avatar alt={`Avatar `} src={contact?.contact?.avatar} />
          </ListItemAvatar>
          <ListItemText primary={contact.contact.fullname} />
        </ListItem>
      </List>
    </div>
  );
}
