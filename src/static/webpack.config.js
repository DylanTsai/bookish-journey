const webpack = require('webpack');
const config = {
    entry: {
	// TODO: Add a line here for every source file created
        index: __dirname + '/js/app.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};
module.exports = config;
