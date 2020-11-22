const path = require("path");
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
			},
		],
	},
	devtool: "inline-source-map",
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	target: "node",
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
		new HtmlWebpackPlugin(),
		new ForkTsCheckerWebpackPlugin({
			async: false,
			eslint: {
				files: "./src/**/*",
			},
		}),
	],
};
