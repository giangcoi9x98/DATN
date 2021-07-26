import React, { useState } from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { IconButton, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) => ({
  wrapImg: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,

  },
  closeBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    display: 'flex',
    cursor: 'pointer',
    marginTop: '5px',
    zIndex: 5,
    width: '100%',
  },
}));
function ImageReader(props) {
  const { image, width, height, handleCloseImg } = props ;
  const classes = useStyle();
  const [url, setUrl] = useState('');
  const reader = new FileReader();
  const imageUrl = reader.readAsDataURL(image);
  reader.onloadend = function (e) {
    setUrl(reader.result);
  };
  const renderImg = () => {
    if (image) {
      return (
        <img
          style={{
            zIndex: 4,
            width: width,
            height: height,
          }}
          alt='image_reader'
          src={url}
        />
      );
    } else {
      return (
        <div></div>
      )
    }
  };
  // console.log('url', imageUrl); // Would see a path?
  return (
    <Paper className={classes.wrapImg} >
      <div className={classes.closeBtn}>
        <IconButton onClick={() =>handleCloseImg(image.name)}>
          <HighlightOffIcon />
        </IconButton>
      </div>
      {renderImg()}
    </Paper>
  );
}

export default ImageReader;
