import "./chat.scss";

import React from "react";
import { Observable } from "rxjs";
import { uniqueId } from "lodash";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import {ContainerBase} from "../../lib/component";

import { ChatMessage } from "./chatMessage";


export class Chat extends ContainerBase{
	constructor(props){
		super(props);

		this.state = {
			messages : []
		};

		this._messages$ = Observable.merge(
			this._server.status$.filter(m => m).map(message => <ChatMessage key={uniqueId("server-status")} data={message} type="server-status" author="system" />),
			this._server.on$("users:added").filter(m => m).map(user => <ChatMessage key={uniqueId("user-added")} data={user} type="user-joined" author={user.name}  />),
			this._server.on$("users:removed").filter(m => m).map(user => <ChatMessage key={uniqueId("user-left")} data={user} type="user-left" author={user.name}  /> ),
			this._server.on$("chat:added").filter(m => m).map(message => <ChatMessage key={uniqueId("chat-message")} data={message} type="user-message" author={message.user.username}  />)
		);

		
	}

	componentWillMount(){
		this.subscribe(this._messages$, newMessage => this.setState({ messages : [...this.state.messages, newMessage]}));
	}

	componentDidMount(){
		const chatBox = document.querySelector(".chat-input");
		const userMessage$ = Observable.fromEvent(chatBox, "keydown")
			.filter(e => e.keyCode === 13)
			.do(() => chatBox.disabled = true)
			.do(e => e.preventDefault())
			.map(e => e.target.value.trim())
			.filter(e => e.length);

		this.subscribe(userMessage$, message => {
			chatBox.value = "";
			chatBox.disabled = false;
			this._server.emitAction$("chat:add", { user: this.props.auth, message, type: "normal" });
		});
	}

	render(){
		return (
			<section className="chat">
				<ul className="chat-messages">
					{ this.state.messages } 
				</ul>
				<div className="chat-form">
					<div className="chat-error"></div>
					<input type="text" className="chat-input" placeholder="Enter a message" />
				</div>
			</section>
		);
	}
}



Chat.PropTypes = {
	auth: PropTypes.object.isRequired
};


export default connect(state => { 
	return {
		auth: state.auth
	};
})(Chat);