
// Require local webpack
const webpack = require('webpack');

const config = {
    context: `${__dirname }/src/js`,
    entry: ['@babel/polyfill', './index.js'],

    // Output params
    output: {
        path: `${__dirname }/build/js`,
        // publicPath: '/assets/',
        filename: '[name].js',
    },

    // Loaders params
    module: {
        loaders: [
            {
                test: /jquery\.js$/,
                loader: 'expose-loader?$!expose-loader?jQuery',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|vendor)/,
                loader: 'babel-loader',
            },
        ],
    },
};

module.exports = config;
