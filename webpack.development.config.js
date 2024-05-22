const path = require('path');
const webpack = require('webpack');
const config = require('config');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	mode: 'development',
	entry: {
		app: [
			'whatwg-fetch',
			'webpack/hot/dev-server',
			'webpack-dev-server/client?http://192.168.1.4:8080/',
			'./client/css/grampacker.scss',
			'./client/grampacker.js',
		],
		share: [
			'./client/css/share.scss',
			'webpack/hot/dev-server',
			'webpack-dev-server/client?http://192.168.1.4:8080/',
		],
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: 'http://192.168.1.4:8080/dist/',
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					compilerOptions: {
						compatConfig: {
							MODE: 2
						}
					}
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				type: 'asset/resource', // Use 'asset/resource' for versatile handling
				generator: {
					filename: '[name].[ext]?[hash]',
				},
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
					{
						loader: 'resolve-url-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.esm-bundler',
		},
	},

	performance: {
		hints: false,
	},

  devtool: 'eval-source-map',

	plugins: [
		new VueLoaderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    }),
	],

  watch: true,
};
