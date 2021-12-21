import React from 'react';
import { shallow } from 'enzyme';
import NewPost from './NewPost';
import { findTest } from '../../utilities/testUtils';

describe('NewPost', () => {

    let newPost;
    beforeEach(() => {
        newPost = shallow(<NewPost />);
    });

    it('should render the button element to the DOM', () => {
        const newPostButton = findTest(newPost, 'newPost');

        expect(newPostButton.length).toBe(1);
    });

    it('should render the button SVG to the DOM', () => {
        const newPostSvg = findTest(newPost, 'newPostSvg');

        expect(newPostSvg.length).toBe(1);
    });

});