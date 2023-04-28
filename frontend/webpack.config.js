const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "styles", to: "styles"},
                {from: "static/fonts", to: "fonts"},
                // {from: "node_modules/jquery-ui", to: "styles/jquery-ui"},
                // {from: "node_modules/bootstrap/dist/js/bootstrap.js", to: "lib"},
                // {from: "node_modules/jquery/dist/jquery.js", to: "lib"},
                // {from: "node_modules/jquery-ui/dist/jquery-ui.min.js", to: "lib"},
                // {from: "src/lib/common.js", to: "lib"},
                // {from: "src/lib/chart.js", to: "lib"},
                // {from: "src/lib/helpers.js", to: "lib"},
            ],
        }),
        new Webpack.ProvidePlugin ({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery':'jquery'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }],
    },
}