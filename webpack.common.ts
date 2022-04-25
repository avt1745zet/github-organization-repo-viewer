import * as webpack from 'webpack';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
const InjectBodyPlugin = require('inject-body-webpack-plugin').default;

const config: webpack.Configuration = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Github Organization Repo Viewer',
      favicon: './public/favicon.svg',
      meta: {
        'description': 'A react and Github REST API practice.',
        'keyword': 'YY, Github REST API',
        'og:title': 'Github Organization Repo Viewer',
        'og:description': 'A react and Github REST API practice.',
        'og:type': 'website',
      },
    }),
    new InjectBodyPlugin({
      content: '<div id=\"root\"></div>',
      position: 'start',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

export default config;
