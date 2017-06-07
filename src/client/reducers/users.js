import _ from "lodash";

import {USER_LIST, USER_ADDED, USER_REMOVED} from "shared/actions";

export default function(state = [], action) {
	let index = null;
	switch(action.type){
	case USER_LIST:
		return action.payload;
	case USER_ADDED:
		return [
			...state,
			action.payload
		];
	case USER_REMOVED:
		index = _.findIndex(state, { name: action.payload.name });
		if(index === -1)
			return state;

		return [
			...state.slice(0, index),
			...state.slice(index + 1)
		];
	default:
		return state;
	}
}


