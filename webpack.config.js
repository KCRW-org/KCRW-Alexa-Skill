/*jslint node: true */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
    context: path.resolve(__dirname, "src"),
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    resolve: {
        modules: [
            "node_modules"
        ],
    },
    target: "node",
    plugins: [
        // Copy the images folder and optimize all the images
        new CopyWebpackPlugin([{
          from: 'images/',
          to: 'images/'
        }]),
        new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
      ]
};
