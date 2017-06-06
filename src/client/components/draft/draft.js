import "./draft.scss";

import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import {ContainerBase} from "../../lib/component";
import {userLogout} from "../../actions/auth";

import UserList  from "./userList";
import Chat  from "./chat";



export class Draft extends ContainerBase{
	constructor(props){
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogout(e){
		e.preventDefault();
		this.props.dispatch(userLogout(this.props.auth.token));
	}

	render(){
		return (
			<div className="site-wrap">
				<div className="column left">
					<button onClick={this.handleLogout}>Logout</button>
				</div>
				<div className="column center">
					<Chat />
				</div>
				<div className="column right">
					<UserList />
				</div>
			</div>
		);
	}
}


Draft.propTypes = {
	auth: PropTypes.object
};


export default connect(
	(state) => {
		return {
			auth: state.auth
		};
	}
)(Draft);
