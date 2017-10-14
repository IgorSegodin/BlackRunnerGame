const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const input = path.resolve(__dirname, "app");
const output = path.resolve(__dirname, 'dist');

module.exports = {
	entry: {
		"App": "App.js"
	},
	resolve: {
		modules: [input, "node_modules"]
	},
	output: {
		path: output,
		filename: '[name].js',
		chunkFilename: '[name].js'
	},
	devtool: 'inline-source-map',
	// devtool: 'source-map',
	devServer: {
		contentBase: output,
		compress: true,
		host: "0.0.0.0",
		port: 8080
	},
	plugins: [
		new CleanWebpackPlugin([output]),
		new HtmlWebpackPlugin({
			title: 'Black line',
			inject: 'head',
			favicon: path.resolve(input, "favico.ico"),
			hash: true
		}),
		// new UglifyJSPlugin({
		// 	sourceMap: true
		// })
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					'file-loader'
				]
			}
		]
	}
};