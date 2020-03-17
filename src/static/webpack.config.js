const webpack = require('webpack');
const config = {
    entry: {
        test: __dirname + '/js/test.js',
        createPassword: __dirname + '/js/createPassword.tsx'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};
module.exports = config;
