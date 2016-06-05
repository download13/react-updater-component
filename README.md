# react-updater-component

[![Build Status](https://travis-ci.org/download13/react-updater-component.svg?branch=master)](https://travis-ci.org/download13/react-updater-component)

Inspired by [redux](https://github.com/reactjs/redux/), a helper to create components whose state is managed by a built-in reducer. No more `this.setState`. In fact, no more `this`. All component state is stored in the `state` structure, which is managed by `reduce` (see [reducer documentation](http://redux.js.org/docs/basics/Reducers.html)).

[Examples](examples/):

```javascript
import {createComponent} from '@download/react-updater-component';

const Counter = createComponent({
	render({props, state, update}) {
		return <div>
			<button onClick={() => update('INCREMENT', 1)}>+1</button>
			<button onClick={() => update('INCREMENT', 5)}>+5</button>
			<span>Current Count: {state.count}</span>
		</div>;
	},
	reduce(state = {count: 0}, {type, payload}) {
		if(type === 'INCREMENT') {
			return {
				...state,
				count: state.count + payload
			};
		}
		return state;
	}
});

ReactDOM.render(<Counter />, document.getElementById('root'));
```

```javascript
const clockInitialState = {
	interval: null,
	time: 0
};
const Clock = createComponent({
	// Called after the component has mounted
	onMount({update}) {
		const interval = setInterval(refresh, 1000);
		refresh();
		update('SAVE_INTERVAL', interval);

		function refresh() {
			update('SET_TIME', Date.now());
		}
	},
	render({state}) {
		const timeStr = new Date(state.time).toLocaleTimeString();
		return <div>{timeStr}</div>;
	},
	/*
	You can declare an initial state in your reducer. If you are
	not using es6 default parameters then your reducer should return
	the initial state whenever it receives `undefined` for `state`;
	*/
	reduce(state = clockInitialState, {type, payload}) {
		switch(type) {
			case 'SAVE_INTERVAL':
				return {
					...state,
					interval: payload
				};
			case 'SET_TIME':
				return {
					...state,
					time: payload
				};
			default:
				return state;
		}
	},
	// Called before the component unmounts
	onUnmount({state}) {
		clearTimeout(state.interval);
	}
});
```

There is also an `onPropsChange` notifier that works exactly like `onMount` and `onUnmount`.

If you need further documentation just read the [source code](index.es6.js). It's shorter than this README.
