import React from 'react';
import { shallow } from 'enzyme';
import Login from '../Login';
import { findTest } from '../../../utilities/testUtils';

describe('Login', () => {

    let login;
    beforeEach(() => {
        login = shallow(<Login />);
    });
    
    it('should render the login div element to the DOM', () => {
        const loginWrapper = findTest(login, 'login');

        expect(loginWrapper.length).toBe(1);
    });

    it('should render the button elements to the DOM', () => {
        const loginButtons = findTest(login, 'loginButtons');

        expect(loginButtons.length).toBe(2);
    });

    it('should render the SVG element to the DOM', () => {
        const loginSvg = findTest(login, 'loginButtonSvg');

        expect(loginSvg.length).toBe(1);
    });

});