// const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
// console.log("webpack", webpack);

module.exports = {
    webpack: (config, {}) => {
        // config.plugins.push(new webpack.ProvidePlugin({
        //     Vue: 'vue',
        //     VueLoader: 'vue-loader'
        // }));

        // config.plugins.push(new webpack.ProvidePlugin({
        //     Vue: 'vue'
        // }));

        config.resolve.extensions.push('.vue');

        config.module.rules.push(
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
            },
            {
                test: /\.svg$/,
                loader: "url-loader",
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.s([ca])ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    // 'sass-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                indentedSyntax: true // optional
                            },
                        },
                    },
                ],
            });

        config.plugins.push(new VueLoaderPlugin());
        // config.plugins.push(new MiniCssExtractPlugin());

        config.plugins.push(
            new ReplaceInFileWebpackPlugin([{
                dir: 'dist/chrome',
                files: ['manifest.json'],
                rules: [
                    {
                        search: /"scripts(.*)"service_worker"/sig,
                        replace: '"service_worker"'
                    }
                ]
            }])
        )

        return config
    }
};
