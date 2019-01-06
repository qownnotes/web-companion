const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    webpack: (config, {
        src,
        target,
        dev,
        vendor
    }) => {
        config.plugins.push(new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Vue: 'vue',
            VueLoader: 'vue-loader'
        }));

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
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader"
                ]
            });

        config.plugins.push(new VueLoaderPlugin());
        config.plugins.push(new MiniCssExtractPlugin());

        return config
    }
};
