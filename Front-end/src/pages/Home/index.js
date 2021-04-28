import { React } from 'react';
import { useAuth } from '../../hooks/useAuth'
import Home from './Home'
import {withRouter} from 'react-router-dom'
function index(props) {
  const isAuth = useAuth;
  if (!isAuth()) {
    props.history.push("/login")
  }
    return (
      <div>
          <Home></Home>
      </div>
  )
}
export default withRouter(index);
