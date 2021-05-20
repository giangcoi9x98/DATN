import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from './store';
import { Notificator } from './components/Notification';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

let persistor = persistStore(store)
const notistackRef = React.createRef();
const onClickDismiss = (key) => () => {
  notistackRef.current.closeSnackbar(key);
};
ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
          {' '}
          <SnackbarProvider
            maxSnack={5}
            ref={notistackRef}
            action={(key) => (
              <IconButton onClick={onClickDismiss(key)}>
                <CloseIcon />
              </IconButton>
            )}
          >
            <Notificator />
            <App />
          </SnackbarProvider>
        {/* </PersistGate> */}
      </Provider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
