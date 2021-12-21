import React from 'react';
import { mount } from 'enzyme';
import User from '../user';
import { findTest } from '../../../utilities/testUtils';
import store from '../../../app/store';
import { Provider } from 'react-redux';

describe('user', () => {

    let user;
    beforeEach(() => {
      user = mount(
        <Provider store={store}>
          <User />
        </Provider>
      );
    });

    it('should render user div element to the DOM', () => {
        const userDiv = findTest(user, 'user');

        expect(userDiv.length).toBe(1);
    });

    it('should render seven list item elements to the DOM', () => {
        const userList = findTest(user, 'userListItem');

        expect(userList.length).toBe(7);
    });

    it('should render seven SVG elements to the DOM', () => {
        const userSvg = findTest(user, 'userListSvg');

        expect(userSvg.length).toBe(7);
    });

});