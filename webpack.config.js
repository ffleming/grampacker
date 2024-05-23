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
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: 'asset/resource',
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
    performance: {
        hints: false,
    },

    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler',
      },
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
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      }),
    ],
};
