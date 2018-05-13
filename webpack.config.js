const ExtractText = require('extract-text-webpack-plugin');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const extractHtml = new ExtractText('index.html');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
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
        loaders: ['css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        loaders: ['url-loader', `svgo-loader?${JSON.stringify({ plugins: [] })}`],
      },
      {
        test: /\.(eot|woff|ttf)$/,
        loaders: ['url-loader'],
      },
    ],
  },
  plugins: [
    extractHtml,
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
      fetch: 'imports-loader?this=>window!exports-loader?window.fetch!whatwg-fetch',
    }),
    new UglifyJSPlugin(),
  ],
};
