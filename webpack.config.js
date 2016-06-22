var HtmlWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/client/app/index.html',
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  devtool: 'source-map',
  entry: [
    './client/app/index.jsx'
  ],
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        include: __dirname + '/client',
        loader: 'babel-loader',
        exclude: /test/,
        query: {
          presets: ['es2015', 'react']
        },
      },
    ],
  },
  plugins: [HTMLWebpackPluginConfig],
};
