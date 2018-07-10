const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/sw.js'
    }),
    new MiniCssExtractPlugin()
  ]
});
