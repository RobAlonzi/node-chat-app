import {ModuleBase} from "../lib/module";

import {fail} from "shared/observable-socket";

const UserContext = Symbol("UserContext");
export class UsersModule extends ModuleBase{
	constructor(io, auth){
		super();
		this._io = io;
		this._auth = auth;
		this._users = {};
		this._userList = [];
	}

	getUserForClient(client){
		const user = client[UserContext];

		if(!user)
			return null;

		return user.isLoggedIn ? user : null;
	}


	addClient(client, {username, color}){
		const user = client[UserContext] || (client[UserContext] = {});

		//TODO: handle a double log in
		if(user.isLoggedIn)
			return fail("You are already logged in.");

		user.name = username;
		user.color = color;
		user.isLoggedIn = true;

		this._users[username] = client;
		this._userList.push(user);

		this._io.emit("users:added", user);
		console.log(`User ${username} logged in`);
	}


	removeClient(client){
		const user = this.getUserForClient(client);

		if(!user)
			return;
		

		const index = this._userList.indexOf(user);

		console.log(this._userList);
		console.log(index);

		this._userList.splice(index, 1);

		delete this._users[user.username];
		delete client[UserContext]; 

		
		this._io.emit("users:removed", user);
		console.log(`User ${user.name} logged out`);
	}

	registerClient(client){
		client.onActions({
			"users:list": () => {
				return this._userList;
			},
			"users:add": (user) => {
				this.addClient(client, user);
			},
			"users:remove": () => {
				this.removeClient(client);
			}
		});

		client.on("disconnect", () => {
			this.removeClient(client);
		});
	}

}