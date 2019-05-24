import React from 'react';
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Posts from './Posts';
import PostItem from './PostItem/PostItem';

configure({ adapter: new Adapter() });

describe('component: <Posts />', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallow(<Posts posts={[{id: 'someid'}]} />);
    });

    it('should render one <PostItem />', () => {
        expect(wrapper.find(PostItem)).toHaveLength(1);
    });
});