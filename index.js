'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createComponent = createComponent;

var _react = require('react');

function createComponent() {
	var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	if (typeof spec === 'function') {
		spec = { render: spec };
	}
	var _render = spec.render || nop;
	var reduce = spec.reduce || nop;
	var onMount = spec.onMount || nop;
	var onPropsChange = spec.onPropsChange || nop;
	var onUnmount = spec.onUnmount || nop;

	var state = reduce(undefined, { type: '_#@init_action' });

	function model(self, newProps) {
		var props = newProps || self.props;

		return {
			props: props,
			state: state,
			update: function update(type, payload) {
				state = reduce(state, { type: type, payload: payload });
				self.setState({ state: state });
			}
		};
	}

	return (0, _react.createClass)({
		getInitialState: function getInitialState() {
			return { state: state };
		},
		componentDidMount: function componentDidMount() {
			onMount(model(this));
		},
		componentWillReceiveProps: function componentWillReceiveProps(newProps) {
			onPropsChange(model(this, newProps));
		},
		render: function render() {
			return _render(model(this));
		},
		componentWillUnmount: function componentWillUnmount() {
			onUnmount(model(this));
		}
	});
}

function nop() {}