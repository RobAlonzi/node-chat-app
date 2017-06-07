import {server} from "../lib/services";

import {AUTH_SUCCESS, AUTH_ERROR, AUTH_LOADING, AUTH_LOGOUT} from "shared/actions";
import {validateCreateUser} from "shared/validation/auth";


export const userCreate = (email, username, password, password_confirm) => {
	return (dispatch) => {
		dispatch(authLoading());

		username = username.trim();
		password = password.trim();
		const validator = validateCreateUser(email, username, password, password_confirm);

		if(validator.errors.length > 0)
			return dispatch(authError(validator.message));

		server.emitAction$("auth:create", {email, username, password, password_confirm}).subscribe(user => {
			localStorage.setItem('userToken', user.token);
			dispatch(authSuccess(user));
		}, error => {
			dispatch(authError(error.message));
		});
	};
};


export const userLogin = (username, password) => {
	return (dispatch) => {
		dispatch(authLoading());

		username = username.trim();
		password = password.trim();

		if(username.length == 0)
			return dispatch(authError("Username required."));

		if(password.length == 0)
			return dispatch(authError("Password required."));
		
		server.emitAction$("auth:login", {username, password}).subscribe(user => {
			localStorage.setItem('userToken', user.token);
			dispatch(authSuccess(user));
		}, error => {
			dispatch(authError(error.message));
		});

	};
};

export const userLoginByToken = (token) => {
	return (dispatch) => {
		dispatch(authLoading());

		server.emitAction$("auth:verify", token).subscribe(user => {
			dispatch(authSuccess(user));
		}, error => {
			dispatch(authError(error.message));
		});

	};
};

export const userLogout = (token) => {
	return (dispatch) => {
		localStorage.removeItem('userToken');	
		dispatch(authLoading());
		
		server.emitAction$("auth:logout", token).subscribe(() => {
			dispatch(authLogout());
		}, error => {
			dispatch(authError(error.message));
		});
	};
};

const authSuccess = (user) => {
	return {
		type: AUTH_SUCCESS,
		payload: user
	};
};

const authError = (error) => {
	return {
		type: AUTH_ERROR,
		payload: error
	};
};


const authLoading = () => {
	return {
		type: AUTH_LOADING
	};
};

const authLogout = () =>{
	return{
		type: AUTH_LOGOUT
	};
};