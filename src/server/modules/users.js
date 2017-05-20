import {Observable} from "rxjs";

import {ModuleBase} from "../lib/module";

export class UsersModule extends ModuleBase{
	constructor(io){
		super();
		this._io = io;
		this._userList = [];
		this._users = {};
	}

	loginClient$(client, username){
		return Observable.of("Hello", username);
	}

	registerClient(client){
		client.onActions({
			"auth:login": ({name}) => {
				return this.loginClient$(client, name);
			}
		});

		client.on("disconnect", () => {
			console.log("Logout");
		});
	}

}