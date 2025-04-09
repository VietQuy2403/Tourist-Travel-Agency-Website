const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      "process/browser": require.resolve("process/browser"),
      "process": require.resolve("process/browser"),
      "vm": false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  ]
}; 