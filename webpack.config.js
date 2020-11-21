const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/Main.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	target: "node",
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: {
		minimize: false,
	},
	plugins: [
		new HtmlWebpackPlugin()
	],
};