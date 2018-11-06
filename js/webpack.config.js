const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.dist.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "../../css/[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
    ]
  },

}