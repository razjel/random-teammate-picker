const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
	entry: "./src/Main.tsx",
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					plugins: ["recharts"],
				},
			},
		],
	},
	devtool: "inline-source-map",
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	target: "es6",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist"),
	},
	optimization: {
		minimize: false,
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: false,
		port: 3333,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "random teammate picker",
			template: "htmlTemplate/index.html",
		}),
		new ForkTsCheckerWebpackPlugin({
			async: false,
			eslint: {
				files: "./src/**/*",
			},
		}),
		new webpack.DefinePlugin({
			"process.env": {
				isDebug: true,
			},
		}),
	],
};
