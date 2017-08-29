/*jslint node: true */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
  entry: './src/index.js',
  target: 'node',
  plugins: [
    // Copy the images folder and optimize all the images
    new CopyWebpackPlugin([{
      from: './src/images/',
      to: 'images/'
    }]),
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
  ]
};
