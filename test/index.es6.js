import {jsdom} from 'jsdom';
global.document = jsdom('');
global.window = document.defaultView;
import React from 'react';
import {createComponent} from '../index';
import expect from 'expect.js';
import {shallow, mount} from 'enzyme';


describe('Component', () => {
	it('is creatable', () => {
		const c = createComponent();
		expect(c).to.be.ok();
	});
	it('is creatable with a render function', () => {
		const c = createComponent(() => null);
		expect(c).to.be.ok();
	});
	it('is creatable with a spec', () => {
		const c = createComponent({
			render() {
				return null;
			},
			reduce(state, action) {
				return state;
			}
		});
		expect(c).to.be.ok();
	});
	it('renders based on props', () => {
		const Comp = createComponent(({props}) => <div id={props.id}>Test</div>);
		expect(shallow(<Comp id="testid" />).is('#testid')).to.be.ok();
	});
	it('can have an initial state', () => {
		const initialState = {key: 'value'};
		const Comp = createComponent({
			render({state}) {
				return <div>{state.key}</div>;
			},
			reduce(state = initialState) {
				return state;
			}
		});
		expect(shallow(<Comp />).text()).to.be.equal('value');
	});
	it('can update it\'s state', () => {
		const initialState = {number: 4};
		const Comp = createComponent({
			render({state, update}) {
				return <div onClick={() => update('UPDATE_NUMBER', 73)}>{state.number}</div>;
			},
			reduce(state = initialState, {type, payload}) {
				if(type === 'UPDATE_NUMBER') {
					return {
						...state,
						number: state.number + payload + 5
					};
				}
				return state;
			}
		});

		const wrapper = shallow(<Comp />);
		wrapper.simulate('click');
		expect(wrapper.text()).to.be.equal('82');
	});
	it('is notified when mounted', () => {
		const initialState = {mounted: false};
		const Comp = createComponent({
			onMount({update}) {
				update('MOUNT');
			},
			render({state}) {
				return <div>{state.mounted}</div>;
			},
			reduce(state = initialState, {type}) {
				if(type === 'MOUNT') {
					return {...state, mounted: true};
				}
				return state;
			}
		});

		const wrapper = mount(<Comp />);
		wrapper.update();
		expect(wrapper.text()).to.be.equal('true');
	});
	it('is notified when unmounted', () => {
		const initialState = {unounted: false};
		const Comp = createComponent({
			render({state}) {
				return <div>{state.unmounted}</div>;
			},
			reduce(state = initialState, {type}) {
				if(type === 'UNMOUNT') {
					return {...state, unmounted: true};
				}
				return state;
			},
			onUnmount({update}) {
				update('UNMOUNT');
			}
		});

		const wrapper = shallow(<Comp />);
		wrapper.unmount();
		expect(wrapper.text()).to.be.equal('true');
	});
	it('is notified when props change', () => {
		const initialState = {changed: false};
		const Comp = createComponent({
			onPropsChange({props, update}) {
				console.log('props changed', props)
				update('CHANGE', props.ch);
			},
			render({state, props}) {
				return <div>{state.changed}{props.ch}</div>;
			},
			reduce(state = initialState, {type, payload}) {
				if(type === 'CHANGE') {
					return {...state, change: payload};
				}
				return state;
			}
		});

		expect(shallow(<Comp />).setProps({ch: true}).text()).to.be.equal('truetrue');
	});
});
