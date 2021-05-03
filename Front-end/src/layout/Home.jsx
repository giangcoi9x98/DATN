import React from 'react';
import NavBar from '../components/NavBar';
function Home(props) {
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
          flexDirection: 'column',
        }}
      >
        <NavBar></NavBar>
        <div style={{ marginTop: '64px' }}>{props.children}</div>
      </main>
    </div>
  );
}

export default Home;
