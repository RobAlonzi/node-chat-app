import _ from "lodash";

import {ModuleBase} from "../lib/module";
import {success, fail} from "shared/observable-socket";

export class ChatModule extends ModuleBase{
	constructor(io, auth){
		super();
		this._io = io;
		this._auth = auth;
	}

	sendMessage(client, curUser, message, type){

		const auth = this._auth.findUserByToken$(curUser.token);
		
		auth.subscribe(user => {
			// if(curUser.id !== user._id){
			// 	client.emit("chat:add:fail", "Illegal Token provided.")
			// 	return;
			// }
				

			message = message.trim();
			const response = {
				user: curUser,
				message: message,
				time: new Date().getTime(),
				type: type
			};

			console.log(response);
			this._io.emit("chat:added", response);

		}, error => {
			client.emit("chat:add:fail", "Illegal token provided or token has expired. Please refresh the page");
		});
	}

	registerClient(client){
		client.onActions({
			"chat:add": ({user, message, type}) => {
				type = type || "normal";
				this.sendMessage(client, user, message, type);
			}
		});
	}

}