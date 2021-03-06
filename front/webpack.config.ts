//webpack.config.ts
import path from 'path'
import webpack, { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}
const isDevelopment = process.env.NODE_ENV !== 'production'

const config: Configuration = {
    name: 'Carbon',
    mode: isDevelopment ? 'development' : 'production',
    devtool: !isDevelopment ? 'hidden-source-map' : 'inline-source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '@components': path.resolve(__dirname, 'components'),
            '@hooks': path.resolve(__dirname, 'hooks'),
            '@layouts': path.resolve(__dirname, 'layouts'),
            '@pages': path.resolve(__dirname, 'pages'),
            '@utils': path.resolve(__dirname, 'utils'),
            '@typings': path.resolve(__dirname, 'typings'),
            '@resource': path.resolve(__dirname, 'resource'),
        },
    },
    entry: {
        app: './client',
    },
    target: ['web', 'es5'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            // {
                            //     targets: { browsers: ['IE 10'] },
                            //     debug: isDevelopment,
                            // },
                        ],
                        '@babel/preset-react',
                        '@babel/preset-typescript',
                    ],
                    env: {
                        development: {
                            plugins: [
                                ['@emotion/babel-plugin', { sourceMap: true }],
                                require.resolve('react-refresh/babel'),
                            ],
                        },
                        production: {
                            plugins: ['@emotion/babel-plugin'],
                        },
                    },
                },
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: false,
            // eslint: {
            //   files: "./src/**/*",
            // },
        }),
        new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/dist/',
    },
    devServer: {
        historyApiFallback: true,
        port: 3000,
        devMiddleware: { publicPath: '/dist/' },
        static: { directory: path.resolve(__dirname) },
        proxy: {
            '/api/': {
                target: 'http://localhost:3095',
                changeOrigin: true,
                ws: true,
            },
        },
    },
}

if (isDevelopment && config.plugins) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.plugins.push(
        new ReactRefreshWebpackPlugin({
            overlay: {
                useURLPolyfill: true,
            },
        }),
    )
    config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: false }))
}
if (!isDevelopment && config.plugins) {
    config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }))
    config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }))
}

export default config
