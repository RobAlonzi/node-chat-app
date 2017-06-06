import "./userList.scss";

import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import {ContainerBase} from "../../lib/component";

import * as actionCreators from "../../actions/users";
import { UserListItem } from "./userListItem";


export class UserList extends ContainerBase{
	constructor(props){
		super(props);

		this._server.emit("users:add", this.props.auth);
		this._server.emit("users:list");

		this.subscribe(this._server.on$("users:list"), users => this.props.userList(users));
		this.subscribe(this._server.on$("users:removed"), user => this.props.userRemoved(user));
		this.subscribe(this._server.on$("users:added"), user => this.props.userAdded(user));	
	}


	render(){
		return (
			<section className="users">
				<h1>{this.props.users.length} user{this.props.users.length === 1 ? "" : "s"}</h1>
				<ul className="users">
					{ this.props.users.map((user, index) => <UserListItem key={index} {...user} />) }
				</ul>
			</section>
		);
	}
}

UserList.PropTypes = {
	auth: PropTypes.object.isRequired,
	users: PropTypes.array.isRequired
};


export default connect(state => { 
	return {
		auth: state.auth,
		users: state.users 
	};
}, actionCreators)(UserList);
