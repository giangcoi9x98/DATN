import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import routes from '../src/pages/routes';
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
      </Switch>
    </BrowserRouter>
  );
}

export default App;
