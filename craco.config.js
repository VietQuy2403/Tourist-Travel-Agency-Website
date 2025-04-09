const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    "crypto": require.resolve("crypto-browserify"),
                    "stream": require.resolve("stream-browserify"),
                    "buffer": require.resolve("buffer/"),
                    "process": require.resolve("process/browser"),
                    "vm": require.resolve("vm-browserify"),
                    "assert": require.resolve("assert"),
                    "http": require.resolve("stream-http"),
                    "https": require.resolve("https-browserify"),
                    "os": require.resolve("os-browserify"),
                    "url": require.resolve("url"),
                    "util": require.resolve("util")
                }
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: require.resolve("process/browser"),
                Buffer: ['buffer', 'Buffer']
            })
        ]
    }
}; 