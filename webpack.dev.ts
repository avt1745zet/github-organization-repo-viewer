import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import commonConfig from './webpack.common';

const config: webpack.Configuration = merge.merge(commonConfig, {
  devtool: 'eval-source-map',
  mode: 'development',
});

export default config;
