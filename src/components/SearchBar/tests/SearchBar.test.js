import React from 'react';
import { mount } from 'enzyme';
import SearchBar from '../SearchBar';
import { findTest } from '../../../utilities/testUtils';
import { Provider } from 'react-redux';
import store from '../../../app/store';

describe('Search Bar', () => {

    let searchBar;
    beforeEach(() => {
        searchBar = mount(
          <Provider store={store}>
            <SearchBar />
          </Provider>
        );
      });

    it('should render the input element to the DOM', () => {
        const searchBarInput = findTest(searchBar, 'searchBar');

        expect(searchBarInput.length).toBe(1);
    });

    it('should render the search bar SVG to the DOM', () => {
        const searchBarSvg = findTest(searchBar, 'searchBarSvg');

        expect(searchBarSvg.length).toBe(1);
    });

});