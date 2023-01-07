const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin');

const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if(isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
        ]
    }
    return config
}

const plugins = () => {
    const basePlugins = [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new MiniCssExtractPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, 'src/assets'),
        //             to: path.resolve(__dirname, 'dist'),
        //         }
        //     ]
        // })
    ];

    if(isProd) {
        basePlugins.push(new ImageMinimizerPlugin({
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminMinify,
              options: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                  ["gifsicle", { interlaced: true }],
                  ["jpegtran", { progressive: true }],
                  ["optipng", { optimizationLevel: 5 }],
                ],
              },
            },
          }))
    }

    return basePlugins;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/main.js',
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        assetModuleFilename: 'img/[hash][ext][query]',
        clean: true,
    },
    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 3000,
    },
    optimization: optimization(),
    plugins: plugins(),
    devtool: isProd ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
        {
            test: /\.css$/i,
            use:[MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
            test: /\.scss$/i,
            use: [MiniCssExtractPlugin.loader, 
                    "css-loader",
                    "sass-loader"
                ],
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
        },
        {
            test: /\.(?:|gif|png|jpeg|jpg|svg)$/,
            type: 'asset/resource',
        }
    ]
    }
}