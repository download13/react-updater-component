import {createClass} from 'react';


export function createComponent(spec = {}) {
	if(typeof spec === 'function') {
		spec = {render: spec};
	}
	const render = spec.render || nop;
	const reduce = spec.reduce || nop;
	const onMount = spec.onMount || nop;
	const onPropsChange = spec.onPropsChange || nop;
	const onUnmount = spec.onUnmount || nop;

	let state = reduce(undefined, {type: '_#@init_action'});

	function model(self, newProps) {
		const props = newProps || self.props;

		return {
			props,
			state,
			update: (type, payload) => {
				state = reduce(state, {type, payload});
				self.setState({state});
			}
		};
	}

	return createClass({
		getInitialState() {
			return {state};
		},
		componentDidMount() {
			onMount(model(this));
		},
		componentWillReceiveProps(newProps) {
			onPropsChange(model(this, newProps));
		},
		render() {
			return render(model(this));
		},
		componentWillUnmount() {
			onUnmount(model(this));
		}
	});
}


function nop() {}
