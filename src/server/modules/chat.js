import {ModuleBase} from "../lib/module";

export class ChatModule extends ModuleBase{
	constructor(io, auth){
		super();
		this._io = io;
		this._auth = auth;
	}

	sendMessage(client, curUser, message, type){

		const auth = this._auth.findUserByToken$(curUser.token);
		
		auth.subscribe(() => {
			message = message.trim();
			const response = {
				user: curUser,
				message: message,
				time: new Date().getTime(),
				type: type
			};

			this._io.emit("chat:added", response);

		}, error => {
			this._io.to(client._socket.id).emit('chat:added:fail', error);
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