import React from 'react';
import ReactDOM from 'react-dom';
import store from './App/store';
import { Provider } from 'react-redux';
import './index.css';
import './fonts.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
