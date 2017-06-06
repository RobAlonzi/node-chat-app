// THIS IS OUR SERVER ENTRY POINT
require("./config/config");
import "source-map-support/register";

import _ from "lodash";
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import socketIo from "socket.io";
import chalk from "chalk";
import {Observable} from "rxjs"; 

import {ObservableSocket} from "shared/observable-socket";

import {AuthModule} from "./modules/auth";
import {UsersModule} from "./modules/users";
import {ChatModule} from "./modules/chat";

import {startDatabase} from "./database/mongoose";

const isDevelopment = process.env.NODE_ENV !== "production";

// ---------------------------
// Setup
const app = express();
app.use(bodyParser.json());
const server = new http.Server(app);
const io = socketIo(server);
startDatabase();


// ---------------------------
// Client Webpack
if(process.env.USE_WEBPACK === "true"){
	var webpackMiddleware = require("webpack-dev-middleware"),
		webpackHotMiddleware = require("webpack-hot-middleware"),
		webpack = require("webpack"),
		clientConfig = require("../../webpack.client").create(true);

	const compiler = webpack(clientConfig);
	app.use(webpackMiddleware(compiler, {
		publicPath: "/build/",
		stats: {
			colors: true,
			chunks: false,
			assets: false,
			timings: false,
			modules: false,
			hash: false,
			version: false
		}
		
	}));
	
	app.use(webpackHotMiddleware(compiler));
	console.log(chalk.bgRed("Using Webpack Dev Middleware! THIS IS FOR DEV ONLY!"));
}


// ---------------------------
// Configure Express
app.set("view engine", "jade");
app.use(express.static("public"));


const useExternalStyles = !isDevelopment;
app.get("*", (req, res) => {
	res.render("index", {
		useExternalStyles
	});
});


// ---------------------------
// Modules
const users = new UsersModule(io);
const auth = new AuthModule(io, users);
const chat = new ChatModule(io, auth);
const socketModules = [users, auth, chat];

// ---------------------------
// Socket
io.on("connection", socket => {
	console.log(`Got connection from ${socket.request.connection.remoteAddress}`);

	const client = new ObservableSocket(socket);

	for(let mod of socketModules)
		mod.registerClient(client);

	for(let mod of socketModules)
		mod.clientRegistered(client);
});


// ---------------------------
// Startup
const port = process.env.PORT || 3000;
function startServer(){
	server.listen(port, () => {
		console.log(`Started on port ${port}`);
	});
}

Observable.merge(...socketModules.map(m => m.init$()))
	.subscribe({
		complete(){
			startServer();
		},

		error(error){
			console.error(`Could not init module: ${error.stack || error}`);
		}
	});