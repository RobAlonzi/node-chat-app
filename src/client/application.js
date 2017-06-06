// THIS IS OUR CLIENT ENTRY POINT
import "./application.scss";

import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";

import App from "./components/app";


// ------------------
// PLAYGROUND
// services.server.emitAction$("login", {username: "foo", password: "bar"})
// 	.subscribe(user => {
// 		console.log(`LOGGED IN: ${JSON.stringify(user)}`);
// 	}, error => {
// 		console.error(error);
// 	});

// ------------------
// Auth



// ------------------
// Bootstrap

const store = require("./store/index").configure();
ReactDOM.render(
<Provider store={store}>
	<App />
</Provider>,
document.getElementById('root')
);
