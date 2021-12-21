import React from 'react';
import { shallow } from 'enzyme';
import MainLinks from './MainLinks';
import { findTest } from '../../utilities/testUtils';

describe('Main Links', () => {

    let mainLinks;
    beforeEach(() => {
        mainLinks = shallow(<MainLinks />);
    });

    it('should render the list item elements to the DOM', () => {
        const mainLinksItems = findTest(mainLinks, 'mainLinks');

        expect(mainLinksItems.length).toBe(3);
    });

});