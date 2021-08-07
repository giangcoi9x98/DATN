import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import config from '../configs';

const ResultSearch = memo(({ rsSearch, keyword }) => {
  console.log('object :>> ', rsSearch);
  return (
    <Box
      style={{
        position: 'absolute',
        top: '113%',
        left: '34%',
        display: rsSearch?.length && keyword ? 'flex' : 'none',
      }}
      boxShadow={2}
    >
      <List
        style={{
          display: rsSearch?.length && keyword ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          flexDirection: 'column',
          width: '300px',
          overflow: 'scroll',
        }}
      >
        {rsSearch?.map((e, index) => (
          <ListItem
            button
            style={{
              cursor: 'pointer',
              height: '45px',
            }}
            key={index}
            onClick={() => {
              if(e?.post){
                window.location.href =`${config.DOMAIN}post/${e?.post.id}`
              } else {
                window.location.href =`${config.DOMAIN}profile/${e?.contact.email.split('@')[0]}`

              }
            }}
          >
            <ListItemAvatar>
              {e?.post ? (
                <Avatar>
                  <ImageIcon />
                </Avatar>
              ) : (
                <Avatar src={e?.contact?.avatar} />
              )}
            </ListItemAvatar>
            <ListItemText
              secondary={e?.post ? e?.post?.content : e?.contact.fullname}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
});

export default ResultSearch;
