const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

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
			{
				test: /\.css/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
			},
		],
	},
	devtool: "inline-source-map",
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".scss"],
	},
	target: "es5",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist"),
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
		new MiniCssExtractPlugin(),
		new CleanWebpackPlugin(),
	],
};
