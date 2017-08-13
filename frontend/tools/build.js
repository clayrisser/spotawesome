import webpack from 'webpack';
import clean from './clean';
import copy from './copy';
import logger from './logger';
import run from './run';

export default async function build() {
  const webpackConfig = require('./webpack.config.js').default;
  await run(clean);
  return new Promise((resolve, reject) => {
    try {
      webpack(webpackConfig).run(async (err, stats) => {
        if (err) reject(err);
        logger.info(stats.toString(webpackConfig[0].stats));
        await run(copy);
        resolve('built');
      });
    } catch(err) {
      reject(err);
    }
  }).catch((err) => {
    logger.error(err);
  });
}
