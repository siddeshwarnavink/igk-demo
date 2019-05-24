import React from 'react';
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import MainNavigation from './MainNavigation';
import { BRAND_TITLE } from '../../../constants/brand';

configure({ adapter: new Adapter() });

describe('component: <MainNavigation />', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallow(<MainNavigation />);
    });

    it('should render the title', () => {
        expect(wrapper.find('h1').text()).toEqual(BRAND_TITLE);
    });
});