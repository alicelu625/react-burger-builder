import React from 'react';

import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import {BurgerBuilder} from './BurgerBuilder';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

//connect Enzyme
configure({adapter: new Adapter()});

describe('<BurgerBuilder/>', () => {
    let wrapper;

    beforeEach(() => {
        //add function as a prop to BurgerBuilder component
        wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}}/>);
    });

    //check if there BuildControls if there are ingredients
    it('should render <BuildControls/> when receiving ingredients', () => {
        wrapper.setProps({ings: {lettuce: 0}});
        //to test fail case:
        //wrapper.setProps({ings: null});
        expect(wrapper.find(BuildControls)).toHaveLength(1);
    });
});