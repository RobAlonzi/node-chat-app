import "./login.scss";

import React from "react";
import { connect } from "react-redux";
import {Redirect} from 'react-router-dom';

import {ContainerBase} from "../lib/component";
import {userLogin, userCreate, userLoginByToken} from "../actions/auth";

class Login extends ContainerBase{
	constructor(props){
		super(props);

		this.handleCreateUser = this.handleCreateUser.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleFormSwitch = this.handleFormSwitch.bind(this);

		this.state = {
			prevError: null,
			loginBox : true,
			error : null
		};

	}

	componentWillMount(){
		const token = localStorage.getItem('userToken');
		if(!token)
			return;
		
		this.props.dispatch(userLoginByToken(token));
	}

	componentWillReceiveProps(nextProps){
		let {error} = nextProps.auth;

		if(!error){
			this.setState({error: null});
			return;
		}

		if(error && error !== this.state.prevError){
			this.setState({
				prevError: error,
				error: error
			});
		}
	}

	handleCreateUser(e){
		e.preventDefault();
		let username = e.target.username.value;
		let password = e.target.password.value;
		let password_confirm = e.target.password_confirm.value;
		let email = e.target.email.value;

		this.setState({prevError : null});

		this.props.dispatch(userCreate(email, username, password, password_confirm));
	}

	handleFormSwitch(){
		this.setState({
			loginBox : !this.state.loginBox,
			error: null
		});
	}

	handleLogin(e){
		e.preventDefault();
		let username = e.target.username.value;
		let password = e.target.password.value;

		this.setState({prevError : null});

		this.props.dispatch(userLogin(username, password));
	}

	render(){
		let {loginBox, error} = this.state;
		let {id} = this.props.auth;

		if(id)
			return <Redirect to="/chat"/>;

		return (
			<div className="main-auth-form">
				{ loginBox ?
					<div>
						<h1>Log In</h1>
						<form id="main-login-form" action="#" onSubmit={this.handleLogin}>
							<label htmlFor="username">Username</label>
							<input type="text" name="username" />
							<label htmlFor="password">Password: </label>
							<input type="password" name="password" />
							<button>Login</button>
						</form>
						<p>Not a member? <a href="#" onClick={this.handleFormSwitch}>Create an account.</a></p>
					</div>
					: 
					<div>
						<h1>Create User</h1>
						<form id="main-create-form" action="#" onSubmit={this.handleCreateUser}>
							<label htmlFor="email">Email</label>
							<input type="text" name="email" />
							<label htmlFor="username">Username</label>
							<input type="text" name="username" />
							<label htmlFor="password">Password: </label>
							<input type="password" name="password" />
							<label htmlFor="password_confirm">Confirm Password: </label>
							<input type="password" name="password_confirm" />
							<button>Create Account</button>
						</form>
						<p>Already a member? <a href="#" onClick={this.handleFormSwitch}>Login.</a></p>
					</div>	
				}

				{ error ?
				<div className="login-error">
					<p>ERROR: {error}</p>
				</div>
				: null}
			</div>
		);
	}
}




export default connect(
	(state) => {
		return {
			auth: state.auth
		};
	}
)(Login);