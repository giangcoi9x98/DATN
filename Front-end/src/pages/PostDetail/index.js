import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DetailPost from './PostDetail';

function Index(props) {
  return (
    <div>
      <DetailPost></DetailPost>
    </div>
  );
}
export default withRouter(Index);
