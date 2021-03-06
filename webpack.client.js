var path = require("path"),
	webpack = require("webpack"),
	ExtractTextPlugin = require("extract-text-webpack-plugin");

//3rd party modules
const vendorModules = ["lodash", "socket.io-client", "moment", "rxjs", "react", "react-redux", "react-router-dom", "prop-types"];

const dirname = path.resolve("./");
function createConfig(isDebug){
	const devTool = isDebug ? "eval-source-map" : "source-map";
	const plugins = [ new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename: "vendor.js"})];

	const cssLoader = { test: /\.css$/, use: ["style-loader", "css-loader"]};
	const sassLoader = { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"]};
	const appEntry = ["./src/client/application.js"];

	if(!isDebug){
		plugins.push(new webpack.optimize.UglifyJsPlugin());
		plugins.push(new ExtractTextPlugin("[name].css"));
		plugins.push(new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}));

		cssLoader.use = ExtractTextPlugin.extract("css-loader");
		sassLoader.use = ExtractTextPlugin.extract("css-loader!sass-loader");
	}else{
		plugins.push(new webpack.HotModuleReplacementPlugin());
		appEntry.splice(0,0, "webpack-hot-middleware/client");
	}


	// ---------------------
	// WEBPACK CONFIG
	return {
		devtool: devTool,
		entry: {
			application: appEntry,
			vendor: vendorModules
		},
		output: {
			path: path.join(dirname, "public", "build"),
			filename: "[name].js",
			publicPath: "/build/"
		},
		resolve:{
			alias: {
				shared: path.join(dirname, "src", "shared")
			}
		},
		module : {
			rules: [
				{ test: /\.js$/, loader:["babel-loader", "eslint-loader"], exclude: "/node_modules/" },
				{ test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)$/, loader:"url-loader?limit=1024"},
				cssLoader,
				sassLoader
			]
		},
		plugins: plugins
	};
	// ---------------------
}

module.exports = createConfig(true);
module.exports.create = createConfig;