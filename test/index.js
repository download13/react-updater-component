'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsdom = require('jsdom');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('../index');

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _enzyme = require('enzyme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.document = (0, _jsdom.jsdom)('');
global.window = document.defaultView;


describe('Component', function () {
	it('is creatable', function () {
		var c = (0, _index.createComponent)();
		(0, _expect2.default)(c).to.be.ok();
	});
	it('is creatable with a render function', function () {
		var c = (0, _index.createComponent)(function () {
			return null;
		});
		(0, _expect2.default)(c).to.be.ok();
	});
	it('is creatable with a spec', function () {
		var c = (0, _index.createComponent)({
			render: function render() {
				return null;
			},
			reduce: function reduce(state, action) {
				return state;
			}
		});
		(0, _expect2.default)(c).to.be.ok();
	});
	it('renders based on props', function () {
		var Comp = (0, _index.createComponent)(function (_ref) {
			var props = _ref.props;
			return _react2.default.createElement(
				'div',
				{ id: props.id },
				'Test'
			);
		});
		(0, _expect2.default)((0, _enzyme.shallow)(_react2.default.createElement(Comp, { id: 'testid' })).is('#testid')).to.be.ok();
	});
	it('can have an initial state', function () {
		var initialState = { key: 'value' };
		var Comp = (0, _index.createComponent)({
			render: function render(_ref2) {
				var state = _ref2.state;

				return _react2.default.createElement(
					'div',
					null,
					state.key
				);
			},
			reduce: function reduce() {
				var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];

				return state;
			}
		});
		(0, _expect2.default)((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).text()).to.be.equal('value');
	});
	it('can update it\'s state', function () {
		var initialState = { number: 4 };
		var Comp = (0, _index.createComponent)({
			render: function render(_ref3) {
				var state = _ref3.state;
				var update = _ref3.update;

				return _react2.default.createElement(
					'div',
					{ onClick: function onClick() {
							return update('UPDATE_NUMBER', 73);
						} },
					state.number
				);
			},
			reduce: function reduce() {
				var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
				var _ref4 = arguments[1];
				var type = _ref4.type;
				var payload = _ref4.payload;

				if (type === 'UPDATE_NUMBER') {
					return _extends({}, state, {
						number: state.number + payload + 5
					});
				}
				return state;
			}
		});

		var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
		wrapper.simulate('click');
		(0, _expect2.default)(wrapper.text()).to.be.equal('82');
	});
	it('is notified when mounted', function () {
		var initialState = { mounted: false };
		var Comp = (0, _index.createComponent)({
			onMount: function onMount(_ref5) {
				var update = _ref5.update;

				update('MOUNT');
			},
			render: function render(_ref6) {
				var state = _ref6.state;

				return _react2.default.createElement(
					'div',
					null,
					state.mounted
				);
			},
			reduce: function reduce() {
				var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
				var _ref7 = arguments[1];
				var type = _ref7.type;

				if (type === 'MOUNT') {
					return _extends({}, state, { mounted: true });
				}
				return state;
			}
		});

		var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Comp, null));
		wrapper.update();
		(0, _expect2.default)(wrapper.text()).to.be.equal('true');
	});
	it('is notified when unmounted', function () {
		var initialState = { unounted: false };
		var Comp = (0, _index.createComponent)({
			render: function render(_ref8) {
				var state = _ref8.state;

				return _react2.default.createElement(
					'div',
					null,
					state.unmounted
				);
			},
			reduce: function reduce() {
				var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
				var _ref9 = arguments[1];
				var type = _ref9.type;

				if (type === 'UNMOUNT') {
					return _extends({}, state, { unmounted: true });
				}
				return state;
			},
			onUnmount: function onUnmount(_ref10) {
				var update = _ref10.update;

				update('UNMOUNT');
			}
		});

		var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
		wrapper.unmount();
		(0, _expect2.default)(wrapper.text()).to.be.equal('true');
	});
	it('is notified when props change', function () {
		var initialState = { changed: false };
		var Comp = (0, _index.createComponent)({
			onPropsChange: function onPropsChange(_ref11) {
				var props = _ref11.props;
				var update = _ref11.update;

				console.log('props changed', props);
				update('CHANGE', props.ch);
			},
			render: function render(_ref12) {
				var state = _ref12.state;
				var props = _ref12.props;

				return _react2.default.createElement(
					'div',
					null,
					state.changed,
					props.ch
				);
			},
			reduce: function reduce() {
				var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
				var _ref13 = arguments[1];
				var type = _ref13.type;
				var payload = _ref13.payload;

				if (type === 'CHANGE') {
					return _extends({}, state, { change: payload });
				}
				return state;
			}
		});

		(0, _expect2.default)((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).setProps({ ch: true }).text()).to.be.equal('truetrue');
	});
});