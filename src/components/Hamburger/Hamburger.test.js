import React from 'react';
import { shallow } from 'enzyme';
import Hamburger from './Hamburger';
import { findTest } from '../../utilities/testUtils';

describe('Hamburger', () => {

    let hamburger;
    beforeEach(() => {
        hamburger = shallow(<Hamburger />);
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