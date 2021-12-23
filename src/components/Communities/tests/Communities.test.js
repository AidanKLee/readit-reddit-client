import React from 'react';
import { mount } from 'enzyme';
import Communities from '../Communities';
import { findTest } from '../../../utilities/testUtils';
import { Provider } from 'react-redux';
import store from '../../../app/store';

describe('Communities', () => {

    let communities;
    beforeEach(() => {
        communities = mount(
          <Provider store={store}>
            <Communities />
          </Provider>
        );
      });

    it('should render the svg elements to the DOM', () => {
        const communitiesSvgs = findTest(communities, 'communitiesSvgs');

        expect(communitiesSvgs.length).toBe(2);
    });

    it('should render the input element to the DOM', () => {
        const communitiesInput = findTest(communities, 'communitiesInput');

        expect(communitiesInput.length).toBe(1);
    });

    it('should render the unordered list element to the DOM', () => {
        const communitiesList = findTest(communities, 'communitiesList');

        expect(communitiesList.length).toBe(1);
    });

    // it('should render the list item element(s) to the DOM', () => {
    //     const communitiesListItem = findTest(communities, 'communitiesListItem');

    //     expect(communitiesListItem.length).toBe(8);
    // });

});