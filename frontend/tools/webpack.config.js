import _ from 'lodash';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';

const DEBUG = !process.argv.includes('--release') && !process.argv.includes('build');
const VERBOSE = process.argv.includes('--verbose');

const config = {
  context: path.resolve(__dirname, '../src/'),
  output: {
    path: path.resolve(__dirname, '../dist/public/'),
    publicPath: '/'
  },
  module: {
    loaders: [
      { // local styles
        test: /\.scss$/,
        exclude: [
          path.resolve(__dirname, '../node_modules/'),
          path.resolve(__dirname, '../src/styles/')
        ],
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: DEBUG,
            modules: true,
            localIdentName: DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            minimize: !DEBUG
          })}`,
          'postcss-loader?config=./tools/postcss.config.js',
          'sass-loader'
        ]
      },
      { // global styles
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, '../node_modules/'),
          path.resolve(__dirname, '../src/styles/')
        ],
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: DEBUG,
            modules: true,
            localIdentName: '[local]',
            minimize: !DEBUG
          })}`,
          'postcss-loader?config=./tools/postcss.config.js',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [],
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

const clientConfig = _.merge({}, config, {
  entry: './core/client.jsx',
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../dist/public/'),
    filename: 'client.js'
  },
  module: {
    loaders: _.flatten([config.module.loaders, [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, '../src/')],
        loader: 'babel-loader',
        options: JSON.stringify({
          cacheDirectory: DEBUG,
          babelrc: false,
          presets: [
            'react',
            ['es2015', { modules: false }],
            'stage-0'
          ],
          plugins: _.flatten([[
            'transform-runtime'
          ], DEBUG ? [] : [
            'babel-plugin-transform-async-to-generator',
            'transform-react-remove-prop-types',
            'transform-react-constant-elements',
            'transform-react-inline-elements'
          ]])
        })
      }
    ]])
  },
  plugins: _.flatten([[
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      'process.env.BROWSER': true
    }),
    new AssetsPlugin({
      path: path.resolve(__dirname, '../dist/'),
      filename: 'assets.js',
      processOutput: (assets) => `module.exports = ${JSON.stringify(assets)};`
    }),

  ], DEBUG ? [] : [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.jsx?$/,
      minimize: true,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  ]]),
  devtool: DEBUG ? 'source-map' : false
});

const serverConfig = _.merge({}, config, {
  entry: {
    server: './core/server.jsx'
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: _.flatten([config.module.loaders, [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, '../src/')],
        loader: 'babel-loader',
        options: JSON.stringify({
          cacheDirectory: DEBUG,
          babelrc: false,
          presets: [
            'react',
            'es2015',
            'stage-0',
            'node5'
          ],
          plugins: _.flatten([[
            'transform-runtime'
          ], DEBUG ? [] : [
            'transform-react-remove-prop-types',
            'transform-react-constant-elements',
            'transform-react-inline-elements'
          ]])
        })
      }
    ]])
  },
  node: {
    __dirname: false,
    __filename: false,
    console: false,
    global: false,
    process: false,
    Buffer: false
  },
  externals: [
    nodeExternals(),
    /^\.\/assets$/
  ],
  devtool: DEBUG ? 'source-map' : false,
  plugins: _.flatten([[], DEBUG ? [] : []])
});

export default [clientConfig, serverConfig];
