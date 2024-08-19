const webpack = require('webpack');

module.exports = {
    // ... other configuration settings
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
        },
    },
};