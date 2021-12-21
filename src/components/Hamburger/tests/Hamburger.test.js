import React from 'react';
import { mount } from 'enzyme';
import Hamburger from '../Hamburger';
import { findTest } from '../../../utilities/testUtils';
import { Provider } from 'react-redux';
import store from '../../../app/store';

describe('Hamburger', () => {

    let hamburger;
    beforeEach(() => {
        hamburger = mount(
          <Provider store={store}>
            <Hamburger />
          </Provider>
        );
      });

    it('should render the first div element to the DOM', () => {
        const hamburgerDiv = findTest(hamburger, 'line1');

        expect(hamburgerDiv.length).toBe(1);
    });

    it('should render the second div element to the DOM', () => {
        const hamburgerDiv = findTest(hamburger, 'line2');

        expect(hamburgerDiv.length).toBe(1);
    });

    it('should render the third div element to the DOM', () => {
        const hamburgerDiv = findTest(hamburger, 'line3');

        expect(hamburgerDiv.length).toBe(1);
    });

});