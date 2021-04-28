import React from 'react';
import NavBar from '../components/NavBar'
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
        flexDirection:'column',

      }}
    >
        <NavBar></NavBar>
      {props.children}
    </main>
  </div>
  )
}

export default Home