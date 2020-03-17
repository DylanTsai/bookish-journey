const webpack = require('webpack');
const config = {
    entry: {
<<<<<<< HEAD
        test: __dirname + '/js/test.js',
        createPassword: __dirname + '/js/createPassword.tsx'
=======
	// TODO: Add a line here for every source file created
        index: __dirname + '/js/app.js'
>>>>>>> 969898a1215873a414143c2629469e40db264d44
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
