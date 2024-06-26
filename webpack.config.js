/*jslint node: true */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  stats: 'minimal',
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  plugins: [
    // Copy the images folder and optimize all the images
    new CopyWebpackPlugin({
      patterns: [
        {from: './src/images/', to: 'images/'}
      ]
    }),
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
  ]
};
