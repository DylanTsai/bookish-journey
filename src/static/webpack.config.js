const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = {
    entry: {
        // TODO: Add a line here for every source file created
        test: __dirname + '/js/test.js',
        createProfile: __dirname + '/js/createProfile.tsx'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js',
    },
    plugins: [new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
    })],
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
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: "style-loader" },
                    { loader: "@teamsupercell/typings-for-css-modules-loader" },
                    { loader: "css-modules-typescript-loader" },
                    { loader: "css-loader", options: { modules: true } }
                ]
            }
        ]
    }
};
module.exports = config;
