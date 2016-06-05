import React from 'react';
import {render} from 'react-dom';
import {createComponent} from '../index';


const Counter = createComponent({
	render({state, update}) {
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

const clockInitialState = {
	interval: null,
	time: 0
};
const Clock = createComponent({
	onMount({update}) {
		const interval = setInterval(refresh, 1000);
		refresh();
		update('SAVE_INTERVAL', interval);

		function refresh() {
			console.log('Clock exists')
			update('SET_TIME', Date.now());
		}
	},
	render({state}) {
		const timeStr = new Date(state.time).toLocaleTimeString();
		return <div>{timeStr}</div>;
	},
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
	onUnmount({state}) {
		clearTimeout(state.interval);
	}
});

const App = () => <div>
	<Clock />
	<Counter />
</div>;


const rootEl = document.getElementById('root');
render(<App />, rootEl);
