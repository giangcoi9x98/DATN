import React from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

const Like = ({ totalLike, liked, likeAction }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    {totalLike > 0 ? totalLike : ''}
    <IconButton
      style={{
        color: liked ? 'red' : '',
      }}
      aria-label='add to favorites'
      onClick={() => likeAction()}
    >
      <FavoriteIcon />
    </IconButton>
  </div>
  )
}

export default Like;
