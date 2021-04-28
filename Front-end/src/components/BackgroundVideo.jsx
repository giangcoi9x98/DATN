import React from 'react';

function Video(props) {
  return (
    <video
      autoPlay
      muted
      loop
      style={{
        height: '100%',
        position: 'absolute ',
        width: '100%',
        padding: 'none',
        left: '50%',
        top: '50%',
        objectFit: 'cover',
        transform: 'translate(-50%, -50%)',
        zIndex: '-1',
        
        // opacity: this.state.loading ? 0 : 1,
        //transition: 'opacity, 2s ease-in-out',
      }}
    >
      <source src='8.mp4' type='video/mp4' />
    </video>
  );
}
export default Video;
