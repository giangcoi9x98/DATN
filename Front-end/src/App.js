import React, { useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import routes from '../src/pages/routes';
import NotFound from './pages/NotFound/NotFound';
import { useAuth } from './hooks/useAuth';
import { useDispatch } from 'react-redux';
import {fetchAllPost} from './store/actions/postAction'
import { getContacts } from './store/actions/contactAction';
import { getProfileAction } from './store/actions/userAction';
function App(props) {
  const isAuth = useAuth();
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (isAuth) {
      async function fetchData() {
        await dispatch(fetchAllPost());
        await dispatch(getContacts());
        await dispatch(getProfileAction());
      }
      fetchData();
    }else{
      window.location = "/login"
    }
  }, [isAuth, dispatch]);

  return (
    <BrowserRouter>
      <Switch>
        {routes.map(
          ({ component: Component, path, layout: Layout, ...rest }) => {
            return (
              <Route
                render={(props) => (
                  <React.Suspense fallback={null}>
                    <Layout>
                      <Component {...props} />
                    </Layout>
                  </React.Suspense>
                )}
                key={path}
                exact
                path={path}
                {...rest}
              />
            );
          }
        )}
        <Route>{NotFound}</Route>
        <Redirect from='/' to='/not-found'>
          {` `}
        </Redirect>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
