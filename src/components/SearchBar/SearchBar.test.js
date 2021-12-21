import React from 'react';
import { shallow } from 'enzyme';
import SearchBar from './SearchBar';
import { findTest } from '../../utilities/testUtils';

describe('Search Bar', () => {

    let newPost;
    beforeEach(() => {
        newPost = shallow(<SearchBar />);
    });

    it('should render the input element to the DOM', () => {
        const searchBar = findTest(newPost, 'searchBar');

        expect(searchBar.length).toBe(1);
    });

    it('should render the search bar SVG to the DOM', () => {
        const searchBarSvg = findTest(newPost, 'searchBarSvg');

        expect(searchBarSvg.length).toBe(1);
    });

});