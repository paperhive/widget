const ExtractText = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const extractHtml = new ExtractText('index.html');

module.exports = {
  entry: './src/index.js',
  output: {
    path: './build',
    filename: 'index.js',
  },
  module: {
    loaders: [
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime'],
        },
      },
      {
        test: /\.html$/,
        loader: extractHtml.extract('html-loader'),
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.svg$/,
        loaders: ['url', `svgo-loader?${JSON.stringify({ plugins: [] })}`],
      },
    ],
  },
  plugins: [
    extractHtml,
    new webpack.ProvidePlugin({
      Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
  ],
};
