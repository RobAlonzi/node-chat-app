import _ from "lodash";
import { Observable } from "rxjs";

import {ModuleBase} from "../lib/module";

import {validateCreateUser} from "shared/validation/auth";
import {User} from "../database/models/user";

import {fail} from "shared/observable-socket";

export class AuthModule extends ModuleBase{
	constructor(io, users){
		super();
		this._io = io;
		this._users = users;
	}

	findUserByToken$(token){
		return Observable.fromPromise(User.findByToken(token)).map(user => this.generateUserCreds(user, token));
	}


	loginUser$(creds){
		const {username, password} = creds;

		return Observable.fromPromise(User.findByCredentials(username, password))
			.flatMap(user => Observable.fromPromise(user.generateAuthToken()).map(token => this.generateUserCreds(user, token)));
	}

	deleteUserToken$(client, token){
		return Observable.fromPromise(User.findByToken(token))
			.flatMap(user => {
				if(!user)
					return fail("Already logged out.");
				
				this._users.removeClient(client);
				return Observable.fromPromise(user.removeToken(token));
			});
	}

	createUser$(email, username, password, password_confirm){
		username = username.trim();

		const validator = validateCreateUser(email, username, password, password_confirm);
		if(validator.errors.length > 0)
			return validator.throw$();	


		let user = new User({email, username, password});
		return Observable.fromPromise(user.save())
			.flatMap(user => Observable.fromPromise(user.generateAuthToken()).map(token => this.generateUserCreds(user, token)));
	}

	generateUserCreds(user, token){
		return {
			id: user._id,
			username: user.username,
			token: token,
			color: this.getColorForUsername(user.username)
		};

	}

	
	getColorForUsername(username){
		let hash = _.reduce(username, (hash, ch) => {
			return ch.charCodeAt(0) + (hash << 6) + (hash << 16) - hash; 
		}, 0);

		hash = Math.abs(hash);
		const hue = hash % 360,
			saturation = hash % 25 + 70,
			lightness = 100 - (hash % 15 + 35);

		return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	}

	registerClient(client){
		client.onActions({
			"auth:login": (creds) => {
				return this.loginUser$(creds);
			},

			"auth:logout": (token) => {
				return this.deleteUserToken$(client, token);
			},

			"auth:create": ({email, username, password, password_confirm}) => {
				return this.createUser$(email, username, password, password_confirm);
			},
			"auth:verify": (token) => {
				return this.findUserByToken$(token);
			}
		});
	}

}