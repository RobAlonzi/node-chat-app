import "normalize.css/normalize.css";
import "./app.scss";

import React, {Component} from "react";
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import createBrowserHistory from 'history/createBrowserHistory';

import * as services from "../lib/services";

import Login from "./login";
import Draft from "./draft/draft";


const history = createBrowserHistory();

class AppContainer extends Component{
	constructor(props){
		super(props);
		services.socket.connect();
	}


	doesAuthExist(){
		const auth = this.props.auth;
		if(auth.id && auth.token)
			return true;
	}

	render(){
		return (
			<Router history={history}>
				<Switch>
					<Route exact path="/" render={() => {
						if(this.doesAuthExist()){
							return <Redirect to="/chat" />;
						}
						
						return <Login />;
					}}/>
					<Route exact path="/chat/" render={() => {
						if(!this.doesAuthExist()){
							return <Redirect to="/" />;
						}
						
						return <Draft />;
					}}/>
				</Switch>
			</Router>
		);
	}

}

AppContainer.propTypes = {
	auth: PropTypes.object
};

export default connect(
	(state) => {
		return {
			auth: state.auth
		};
	}
)(AppContainer);