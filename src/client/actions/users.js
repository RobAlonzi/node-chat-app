import {USER_LIST, USER_ADDED, USER_REMOVED} from "shared/actions";

export const userList = (users) => {
	return {
		type: USER_LIST,
		payload: users
	};
};

export const userAdded = (user) => {
	return {
		type: USER_ADDED,
		payload: user
	};
};


export const userRemoved = (user) => {
	return {
		type: USER_REMOVED,
		payload: user
	};
};
