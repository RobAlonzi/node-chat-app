import "./chatMessage.scss";

import React from "react";
import PropTypes from 'prop-types';
import moment from "moment";

export const ChatMessage = (props) => {
	const {data, author} = props;
	let type = props.type;

	let message = null;
	let style = null;

	if(type === "server-status"){
		const { isConnected, isReconnecting, attempt } = data;

		if(isConnected) message = "connected";
		else if(isReconnecting) message = `reconnecting (attempt ${attempt})`;
		else message = "server has gone down.";
	}

	else if(type === "user-joined"){
		type = "user-action joined";
		style = {color: data.color};
		message = "joined";
	}

	else if(type === "user-left"){
		type = "user-action left";
		style = {color: data.color};
		message = "left";
	}

	else if(type === "user-message"){
		style = { color: data.user.color };
		message = data.message;
	}

	return(
		<li className={`${type}`}>
			<span style={style} className="author">{author}</span>
			<span className="message">{message}</span>
			<time>{moment().format("h:mm:ss a")}</time>
		</li>
	);
};

ChatMessage.propTypes = {
	data: PropTypes.object.isRequired,
	type: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired
};
