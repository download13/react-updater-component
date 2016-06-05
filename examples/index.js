'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TOODO Change this to global module name

var Counter = (0, _index.createComponent)({
	render: function render(_ref) {
		var state = _ref.state;
		var update = _ref.update;

		return _react2.default.createElement(
			'div',
			null,
			_react2.default.createElement(
				'button',
				{ onClick: function onClick() {
						return update('INCREMENT', 1);
					} },
				'+1'
			),
			_react2.default.createElement(
				'button',
				{ onClick: function onClick() {
						return update('INCREMENT', 5);
					} },
				'+5'
			),
			_react2.default.createElement(
				'span',
				null,
				'Current Count: ',
				state.count
			)
		);
	},
	reduce: function reduce() {
		var state = arguments.length <= 0 || arguments[0] === undefined ? { count: 0 } : arguments[0];
		var _ref2 = arguments[1];
		var type = _ref2.type;
		var payload = _ref2.payload;

		if (type === 'INCREMENT') {
			return _extends({}, state, {
				count: state.count + payload
			});
		}
		return state;
	}
});

var clockInitialState = {
	interval: null,
	time: 0
};
var Clock = (0, _index.createComponent)({
	onMount: function onMount(_ref3) {
		var update = _ref3.update;

		var interval = setInterval(refresh, 1000);
		refresh();
		update('SAVE_INTERVAL', interval);

		function refresh() {
			console.log('Clock exists');
			update('SET_TIME', Date.now());
		}
	},
	render: function render(_ref4) {
		var state = _ref4.state;

		var timeStr = new Date(state.time).toLocaleTimeString();
		return _react2.default.createElement(
			'div',
			null,
			timeStr
		);
	},
	reduce: function reduce() {
		var state = arguments.length <= 0 || arguments[0] === undefined ? clockInitialState : arguments[0];
		var _ref5 = arguments[1];
		var type = _ref5.type;
		var payload = _ref5.payload;

		switch (type) {
			case 'SAVE_INTERVAL':
				return _extends({}, state, {
					interval: payload
				});
			case 'SET_TIME':
				return _extends({}, state, {
					time: payload
				});
			default:
				return state;
		}
	},
	onUnmount: function onUnmount(_ref6) {
		var state = _ref6.state;

		clearTimeout(state.interval);
	}
});

var App = function App() {
	return _react2.default.createElement(
		'div',
		null,
		_react2.default.createElement(Clock, null),
		_react2.default.createElement(Counter, null)
	);
};

var rootEl = document.getElementById('root');
(0, _reactDom.render)(_react2.default.createElement(App, null), rootEl);
