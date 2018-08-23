const entry = {
    welcome: './resources/views/welcome/index.js',
    vue: './resources/views/vue/index.js'
};
const outputDir = './public/dist';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: entry,
    output: {
        path: path.join(__dirname, outputDir),
        filename: process.env.NODE_ENV === 'production' ? '[id].[chunkhash].js' : '[name].js'
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, 'resources/assets')
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    ...(process.env.NODE_ENV === 'production' ? [MiniCssExtractPlugin.loader] : ['vue-style-loader']),
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    ...(process.env.NODE_ENV === 'production' ? [MiniCssExtractPlugin.loader] : ['vue-style-loader']),
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['public/dist'], { beforeEmit: true }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin(
            process.env.NODE_ENV === 'production'
                ? {
                      filename: '[id].[chunkhash].css',
                      chunkFilename: '[id].[chunkhash].css'
                  }
                : {
                      filename: '[name].css',
                      chunkFilename: '[name].css'
                  }
        ),
        new MyPlugin()
    ],
    devtool: 'source-map'
};

function MyPlugin() {}

MyPlugin.prototype.apply = function(compiler) {
    compiler.hooks.emit.tap('MyPlugin', compilation => {
        let entries = {};

        for (let [name, entry] of compilation.entrypoints) {
            let files = new Set(entry.chunks.reduce((files, chunk) => files.concat(chunk.files), []));
            entries[name] = {
                js: Array.from(files).filter(file => /\.js$/.test(file)),
                css: Array.from(files).filter(file => /\.css$/.test(file))
            };
        }

        let output = JSON.stringify(entries, null, '  ');
        compilation.assets['entrypoints.json'] = {
            source: () => output,
            size: () => output.length
        };
    });
};
