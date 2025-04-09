const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    "stream": require.resolve("stream-browserify"),
                    "crypto": require.resolve("crypto-browserify"),
                    "buffer": require.resolve("buffer/"),
                    "process": require.resolve("process/browser"),
                    "vm": require.resolve("vm-browserify")
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