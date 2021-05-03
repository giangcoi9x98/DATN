import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import routes from '../src/pages/routes';
import NotFound from './pages/NotFound/NotFound';
function App() {
  const test = () => {
    console.log(routes);
  };
  test();
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
        <Route >
            {NotFound}
        </Route>
        <Redirect from='/' to='/not-found'>
          {` `}
        </Redirect>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
