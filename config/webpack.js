const path = require('path');
const webpack = require('webpack');

module.exports = {
  options: {
    entry: [
      './src/index'
    ],
    output: {
      path: path.join(__dirname, '../../../dist'),
      filename: 'bundle.js',
      publicPath: '/dist/'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        include: path.join(__dirname, '../../../src'),
      }]
    }
  }
};
