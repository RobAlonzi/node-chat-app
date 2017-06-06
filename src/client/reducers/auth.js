import {AUTH_SUCCESS, AUTH_ERROR, AUTH_LOADING, AUTH_LOGOUT} from "shared/actions";


export default function(state = {}, action) {
	switch(action.type){
	case AUTH_LOADING:
		return {
			loading: true
		};
	case AUTH_SUCCESS:
		return {
			loading: false,
			id: action.payload.id,
			username: action.payload.username,
			color: action.payload.color,
			token: action.payload.token
		};
	case AUTH_ERROR:
		return {
			loading: false,
			error: action.payload
		};
	case AUTH_LOGOUT:
		return{
			loading:false
		};
	default:
		return state;
	}
}


