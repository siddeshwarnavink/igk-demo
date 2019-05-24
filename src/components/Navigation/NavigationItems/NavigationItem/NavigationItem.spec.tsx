import React from 'react';
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NavigationItem from './NavigationItem';

configure({ adapter: new Adapter() });

describe('component: <NavigationItem />', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallow(
            <NavigationItem to="/">
                Sample link
            </NavigationItem>
        );
    });

    it('should contain <NavigationItem />', () => {
        expect(wrapper.find(NavigationItem));
    });
});