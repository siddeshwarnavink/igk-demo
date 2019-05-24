import React from 'react';
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Layout from './Layout';
import MainNavigation from '../../components/Navigation/MainNavigation/MainNavigation';

configure({ adapter: new Adapter() });

describe('hoc: <Layout />', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallow(
            <Layout>
                <h1>Dummy content</h1>
            </Layout>
        );
    });

    it('should render the children component(s)', () => {
        expect(wrapper.find('h1')).toHaveLength(1);
    })

    it('should render a <MainNavigation />', () => {
        expect(wrapper.find(MainNavigation)).toHaveLength(1);
    })
});