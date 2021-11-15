const path = require('path');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
      indexOut: {
        import: './src/index.js',
        dependOn: 'configFirebase'
      },
      configFirebase: './src/initialization.js'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    mode: 'production', 
    output: {
        filename: './js/[name].js',
        path: path.resolve(__dirname, 'public')
    }/*,
    plugins: [
      new BundleAnalyzerPlugin()
    ]*/
}