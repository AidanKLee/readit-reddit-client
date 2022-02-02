import React from 'react';
import ReactDOM from 'react-dom';
import store from './App/store';
import { Provider } from 'react-redux';
import './index.css';
import './fonts.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router} from 'react-router-dom';
import './transitions.css';
import { CSSTransition } from 'react-transition-group';

ReactDOM.render(
  // <React.StrictMode>
    <Provider store={store}>
      <Router>
        <CSSTransition
            in={true}
            appear={true}
            timeout={1000}
            classNames='tran1'
          >
            <App />
          </CSSTransition>
      </Router>
    </Provider>
  // </React.StrictMode>
  ,
  document.getElementById('root')
);

reportWebVitals();
