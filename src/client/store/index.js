import * as redux from "redux";
import thunk from "redux-thunk";

import authReducer from "../reducers/auth";
import usersReducer from "../reducers/users";



export const configure = (initalState = {}) => {
	const rootReducer = redux.combineReducers({
		auth: authReducer,
		users: usersReducer
	});

	const store = redux.createStore(
		rootReducer, 
		initalState, 
		redux.compose(redux.applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));

	return store;
};
