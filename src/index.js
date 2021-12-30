import React from 'react';
import ReactDOM from 'react-dom';
import store from './App/store';
import { Provider } from 'react-redux';
import './index.css';
import './fonts.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router} from 'react-router-dom';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
