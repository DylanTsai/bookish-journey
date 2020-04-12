const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const config = {
    plugins: [
        new MiniCssExtractPlugin(),
        new CopyPlugin([
            {
                // copy main html file
                from: __dirname + '/src/templates/*.html',
                to: __dirname + '/dist/[name].html',
            },
            {
                // copy main md files 
                from: __dirname + '/src/templates/*.*',
                to: __dirname + '/dist/templates/main/[name].[ext]',
                ignore: ["*.html"]
            },
            {
                // copy main assets
                from: __dirname + '/src/assets', to: __dirname + '/dist/assets/main'
            },
            {
                // copy project index.html
                from: "src/projects/*/templates/index.html",
                to: __dirname + '/dist/[1].html',
                test: /src\/projects\/(.+)\/templates\/index.html/
            },
            {
                // copy other project html
                from: "src/projects/*/templates/**/*.html",
                to: __dirname + '/dist/[1]/[name].html',
                test: /src\/projects\/(.+)\/templates/
            },
            {
                // copy project md files
                from: "src/projects/*/templates/**/*.*",
                to: __dirname + '/dist/templates/[1]/[name].[ext]',
                test: /src\/projects\/(.+)\/templates/,
                ignore: ["*.html"]
            },
            {
                // copy project assets
                from: "src/projects/*/assets/**/*.*",
                to: __dirname + '/dist/assets/[1]/[name].[ext]',
                test: /src\/projects\/(.+)\/assets/
            }
        ])
    ],
    entry: {
        index: __dirname + '/src/ts/app.tsx'
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
    },
    node: { // workaround for bug in webpack
        fs: 'empty'
    }
};
module.exports = config;
