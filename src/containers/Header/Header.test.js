import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';
import { findTest } from '../../utilities/testUtils';

describe('Header', () => {

    let header;
    beforeEach(() => {
        header = shallow(<Header />);
    });

    it('should render a header HTML element to the DOM', () => {
        const headerHtml = findTest(header, 'header');

        expect(headerHtml.length).toBe(1);
    });

    it('should render a logo and logo text to the DOM', () => {
        const logo = findTest(header, 'headerLogo');
        const logoText = findTest(header, 'headerLogoText');

        expect(logo.length).toBe(1);
        expect(logoText.length).toBe(1);
    });

});