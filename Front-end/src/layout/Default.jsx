import React, { Component } from 'react';
import Video from '../components/BackgroundVideo';
function Default(props) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <main
        style={{
          height: '100%',
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Video></Video>
        <div
          style={{
            height: '100%',
            width: '100%',
            opacity: 0.7,
            zIndex: 0,
            position: 'fixed',
            backgroundColor: '#000000',
          }}
        ></div>
        {props.children}
      </main>
    </div>
  );
}
export default Default;
