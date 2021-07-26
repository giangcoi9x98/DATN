import React  from 'react';
import { withRouter } from 'react-router-dom';
import DetailPost from './PostDetail';

function Index(props) {
  return (
    <div>
      <DetailPost></DetailPost>
    </div>
  );
}
export default withRouter(Index);
