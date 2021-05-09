import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Home from './Home';
import { withRouter } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Index(props) {
  return (
    <div>
      <Home></Home>
    </div>
  );
}
export default withRouter(Index);
