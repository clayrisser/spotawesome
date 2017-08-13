import winston from 'winston';

const VERBOSE = process.argv.includes('--verbose');

winston.loggers.add('default', {
  console: {
    level: VERBOSE ? 'silly' : 'debug',
    colorize: true
  }
});

export default winston.loggers.get('default');
