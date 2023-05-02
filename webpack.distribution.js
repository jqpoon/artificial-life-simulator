const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.ts',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },

  cache: {
    type: 'filesystem',
  },

  mode: 'production',
  devtool: false,
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),

    new CopyPlugin({
      patterns: [
        {
          from: 'index.html',
          context: 'src/',
        },
        {
          from: 'assets/*',
          context: 'src/',
        },
      ],
    }),
  ],

  // list of extensions to resolve, in resolve order
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  // loader to handle TypeScript file type
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
