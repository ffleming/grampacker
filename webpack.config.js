const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

class AssetJsonPlugin {
    apply(compiler) {
        compiler.hooks.done.tap(
            'AssetJsonPlugin',
            (stats) => {
                const assetData = {
                    version: stats.toJson().chunks[0].hash,
                    files: stats.toJson().assetsByChunkName,
                };

                require('fs').writeFileSync(
                    path.join(__dirname, '/public/dist/', 'assets.json'), JSON.stringify(assetData),
                );
            });
    }
}

module.exports = {
    mode: 'production',
    entry: {
        app: [
            'whatwg-fetch',
            './client/css/grampacker.scss',
            './client/grampacker.js',
        ],
        share: [
            './public/js/pies.js',
            './public/js/share.js',
            './client/css/share.scss',
        ],
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js',
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
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]',
                },
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        alias: {
            vue: '@vue/compat',
        },
    },
    performance: {
        hints: false,
    },
    devtool: false,
    plugins: [
        new VueLoaderPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css',
        }),
        new AssetJsonPlugin(),
    ],
  devServer: {
      headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
      },
      host: "192.168.1.4"
  }
}

  headers: {
   "Access-Control-Allow-Origin" : "*",
},
};
