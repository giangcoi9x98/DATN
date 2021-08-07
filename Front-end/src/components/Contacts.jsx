import React, { useState, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Avatar, Tooltip } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getContactsSelected } from '../store/actions/contactAction';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';
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

const CheckboxListSecondary = memo((props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [contact] = useState(props.contact);
  const history = useHistory();
  // const handleToggle = (value) => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setChecked(newChecked);
  // };

  return (
    <div>
      <List dense className={classes.root}>
        <ListItem button>
          <div
            onClick={() => dispatch(getContactsSelected(contact.contact.id))}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '80%',
            }}
          >
            <ListItemAvatar>
              <Avatar alt={`Avatar `} src={contact?.contact?.avatar} />
            </ListItemAvatar>
            <ListItemText primary={contact.contact.fullname} />
          </div>
          <Tooltip title='View Profile' placement='top'>
            <AccountCircleIcon onClick={() => {
              history.push(`/profile/${contact?.contact?.email.split('@')[0]}`)
            }} />
          </Tooltip>
        </ListItem>
      </List>
    </div>
  );
});

export default CheckboxListSecondary;
