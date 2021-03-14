/*
 * @Date: 2021-03-14 14:16:13
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-03-14 16:07:40
 */

import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { TampermonkeyWebpackPlugin } from 'tampermonkey-webpack-plugin';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { join, resolve } from 'path';
import tampermonkeyOptions from './tampermonkey.config';

const host = '127.0.0.1';
const port = 8080;
export default {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: join(__dirname, './src/tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  externals: {},
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'dist'),
    publicPath: `http://${host}:${port}/`,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new TampermonkeyWebpackPlugin(tampermonkeyOptions),
  ],
  devServer: {
    host,
    port,
    filename: 'index.js',
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
  } as WebpackDevServerConfiguration,
} as Configuration;
