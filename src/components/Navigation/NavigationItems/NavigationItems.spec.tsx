import React from 'react';
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });

describe('component: <NavigationItems />', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallow(<NavigationItems />);
    });

    it('should contain <NavigationItem />', () => {
        expect(wrapper.find(NavigationItem));
    });
});