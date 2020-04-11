const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const config = {
    plugins: [
        new MiniCssExtractPlugin(),
        new CopyPlugin([
            { from: __dirname + '/src/templates' , to: __dirname + '/dist' },
            { from: __dirname + '/src/assets' , to: __dirname + '/dist/assets' }
        ])
    ],
    entry: {
        index: __dirname + '/src/ts/app.tsx',
    },
    output: {
        path: __dirname + '/dist/',
        filename: 'js/[name].bundle.js',
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
            },
            {
                test: /\.css$/,
                // exclude: /node_modules/,
                use: [
                    { loader: "style-loader" },
                    { loader: "@teamsupercell/typings-for-css-modules-loader" },
                    { loader: "css-modules-typescript-loader" },
                    { loader: "css-loader", options: { modules: true } }
                ]
            },
            {
                test: /\.(png|jpg)$/i,
                use: [
                    {
                        loader: 'url-loader'
                    },
                ],
            }
        ]
    }
};
module.exports = config;
