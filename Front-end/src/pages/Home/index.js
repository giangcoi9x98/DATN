import React from 'react';
import Home from './Home';
import { withRouter } from 'react-router-dom';

function Index(props) {
  return (
    <div>
      <Home></Home>
    </div>
  );
}
export default withRouter(Index);
