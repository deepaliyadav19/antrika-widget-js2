
const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AntdMomentWebpackPlugin = require('@ant-design/moment-webpack-plugin');
// const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	target: 'web',
	entry: {
		app: './src/index.jsx'
	},
	// mode: 'production',
	// performance: {
	// 	maxAssetSize: isProduction ? 15000000 : 40000000, // 15MB in bytes for prod and 40MB for dev
	// 	maxEntrypointSize: isProduction ? 20000000 : 40000000, // 20MB in bytes for prod and 40MB for dev
	// 	hints: 'warning'
	// },
	output: {
		filename: '[name].[contenthash].js',
		chunkFilename: '[name].[contenthash].js',
		publicPath: process.env.ASSET_PATH || '/',
		path: path.resolve('./build')
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true
						}
					}
				]
			}, {
				test: /\.(ts|tsx)?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}, {
				test: /\.(scss|css)/,
				oneOf: [
					{
						resourceQuery: /^\?global$/,
						use: [
							MiniCssExtractPlugin.loader,
							{
								loader: 'css-loader'
							}, {
								loader: 'sass-loader'
							}
						]
					}, {
						use: [
							MiniCssExtractPlugin.loader,
							{
								loader: 'css-loader',
								options: {
									modules: true,
									localIdentName: '[local]_[hash:base64:5]'
								}
							}, {
								loader: 'sass-loader'
							}
						]
					}
				]
			}, {
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'less-loader',
						options: {
							javascriptEnabled: true,
							strictMath: false,
							modifyVars: { '@primary-color': '#51A9FB' }
						}
					}
				]
			}, {
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							attrs: ['link:href']
						}
					}
				]
			}, {
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'img/'
						}
					}
				]
			}, {
				test: /\.(eot|svg|ttf|woff|woff2|xlsx)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/'
						}
					}
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
			ignoreOrder: true // Enable to remove warnings about conflicting order
		}),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			filename: 'index.html'
		}),
		new webpack.IgnorePlugin({ resourceRegExp: /\.\/native/, contextRegExp: /\/pg\// }),
		new AntdMomentWebpackPlugin()
		// new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/) // Ignore all locale files of moment.js
	],
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts'],
		alias: {
			'@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons.js'),
			react: path.resolve('./node_modules/react')
		}
	},
	devServer: {
		client: {
			overlay: false // Disable default overlay
		},
		historyApiFallback: true,
		proxy: {
			'/api/*': {
				//for local
				target: 'https://local.trackwick.com',
				//for production
				// target: 'http://api.trackwick.com',
				// for dev
				// target: 'http://apitest.trackolap.com',
				pathRewrite: { '^/api': '' },
				changeOrigin: true,
				secure: false
			}
			// '/ws': {
			// 	target: 'wss://wstest.trackwick.com',
			// 	ws: true,
			// 	// target: 'https://shopijiapi.trackwick.com',
			// 	// pathRewrite: { '^/ws': '' },
			// 	changeOrigin: true,
			// 	secure: true
			// }
		}
	}
};
