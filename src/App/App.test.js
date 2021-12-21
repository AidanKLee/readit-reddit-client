import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

describe('App', () => {

  let app;
  beforeEach(() => {
    app = mount(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  it('should render without errors', () => {
    const appWrapper = app.find(`[data-test='App']`);

    expect(appWrapper.length).toBe(1);
  });

});
