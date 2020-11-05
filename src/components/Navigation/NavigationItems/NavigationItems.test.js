import React from 'react';

import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

//connect Enzyme
configure({adapter: new Adapter()});

describe('<NavigationItems />', () => {
    let wrapper;
    
    beforeEach(() => {
        //shallowly render element
        wrapper = shallow(<NavigationItems/>);
    });
    
    //test to have 2 Navigation elements if not authenticated
    it('should render 2 <NavigationItem/> elements if not authenticated', () => {
        //check if wrapper has 2 NavigationItem elements
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    //test to have 3 Navigation elements if authenticated
    it('should render 3 <NavigationItem/> elements if authenticated', () => {
        //pass the props for the shallowly rendered element
        wrapper.setProps({isAuthenticated: true});
        //check if wrapper has 2 NavigationItem elements
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });

    //test to have 3 Navigation elements if authenticated
    it('should have logout <NavigationItem/> element if authenticated', () => {
        //pass the props for the shallowly rendered element
        wrapper.setProps({isAuthenticated: true});
        //check if wrapper has Logout Navigation Item
        expect(wrapper.contains(<NavigationItem link="/logout">Log Out</NavigationItem>)).toEqual(true);
    });
});