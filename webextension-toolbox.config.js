// const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
                test: /\.s(c|a)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        // Requires sass-loader@^8.0.0
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                            },
                        },
                    },
                ],
            });

        config.plugins.push(new VueLoaderPlugin());
        // config.plugins.push(new MiniCssExtractPlugin());

        return config
    }
};
