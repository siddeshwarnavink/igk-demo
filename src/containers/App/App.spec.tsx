import React from 'react';
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import App from './App';
import Layout from '../../hoc/Layout/Layout';

configure({ adapter: new Adapter() });

describe('container: <App />', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallow(<App />);
    });

    it('should render one <Layout />', () => {
        expect(wrapper.find(Layout)).toHaveLength(1);
    });
});