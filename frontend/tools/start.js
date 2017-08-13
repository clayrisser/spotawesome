import _ from 'lodash';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-middleware';
import clean from './clean';
import copy from './copy';
import logger from './logger';
import run from './run';
import runServer from './runServer';

const DEBUG = !process.argv.includes('--release');

export default async function start() {
  let webpackConfig = require('./webpack.config.js').default;
  await run(clean);
  webpackConfig[0] = patchClientConfig(webpackConfig[0]);
  const bundler = webpack(webpackConfig);
  const wp = webpackMiddleware(bundler, {
    stats: webpackConfig[0].stats,
    serverSideRender: true,
    publicPath: webpackConfig[0].output.publicPath
  });
  const hotMiddleware = webpackHotMiddleware(bundler.compilers[0]);
  var middleware = [wp, hotMiddleware];
  bundler.plugin('done', (stats) => {
    handleBundleComplete(middleware, stats);
  });
}

let handleBundleComplete = async (middleware, stats) => {
  handleBundleComplete = (middleware, stats) => {
    !stats.stats[1].compilation.errors.length && runServer('./dist/server.js');
  };
  await run(copy);
  runServer('./dist/server.js').then((host) => {
    const bs = browserSync.create();
    bs.init({
      proxy: {
        target: host,
        middleware: middleware
      }
    });
  }, (err) => logger.error(err));
};

function patchClientConfig(clientConfig) {
  clientConfig.entry = ['webpack-hot-middleware/client'].concat(clientConfig.entry);
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  clientConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
  let babelLoader = _.filter(clientConfig.module.loaders, (loader) => loader.loader === 'babel-loader')[0];
  let babelLoaderOptions = JSON.parse(babelLoader.options);
  babelLoaderOptions.plugins.push(['react-transform', {
    transforms: [
      {
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module']
      }, {
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react']
      },
    ]
  }]);
  babelLoader.options = JSON.stringify(babelLoaderOptions);
  return clientConfig;
}
