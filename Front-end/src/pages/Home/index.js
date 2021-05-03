import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Home from './Home';
import { getProfileAction } from '../../store/actions/userAction';
import { withRouter } from 'react-router-dom';

function Index(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("effect")
     function fetchDataUser() {
      dispatch(getProfileAction());
    }
    fetchDataUser()
  }, [dispatch]);
  console.log('userGlobal', user);

  return (
    <div>
      <Home></Home>
    </div>
  );
}
export default withRouter(Index);
