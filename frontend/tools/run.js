import moment from 'moment';
import logger from './logger';
import { v3 as murmurHash3 } from 'murmur-hash';

const settings = {
  dateFormat: 'HH:MM:ss.SSS',
  diffBy: 'milliseconds'
};

const run = (task, options) => {
  const start = moment();
  if (typeof task.default !== 'undefined') task = task.default;
  starting(start, task, options);
  return task(options).then((res) => {
    const end = moment();
    finished(start, end, task, options);
    return res;
  });
};

function starting(startTime, task, options) {
  let taskColor = getTaskColor(task);
  console.log(`[%s] \x1b[33m%s\x1b[0m ${taskColor}%s\x1b[0m`, `${startTime.format(settings.dateFormat)}`, 'Starting',  `${task.name}${options ? `(${options})` : ''}`);
}

function finished(startTime, endTime, task, options) {
  const time = endTime.diff(startTime, settings.diffBy);
  let taskColor = getTaskColor(task);
  console.log(`[%s] \x1b[32m%s\x1b[0m ${taskColor}%s\x1b[0m %s`, `${endTime.format(settings.dateFormat)}`, 'Finished',  `${task.name}${options ? `(${options})` : ''}`, `after ${time} ms`);
}

function getTaskColor(task) {
  let hash = murmurHash3.x86.hash128(task.name);
  let id = (parseInt(hash[1], 16, 10) % 5) + 2;
  console.log(id);
  return `\x1b[4${id}m`;
}

export default run;

if (require.main === module) {
  let command = process.argv[process.argv.length - 2];
  if (command.substr(command.length - 3) === 'run' || command.substr(command.length - 6) === 'run.js') {
    let task = require(`./${process.argv[process.argv.length - 1]}.js`);
    run(task).catch((err) => {
      logger.error(err);
      process.exit(1);
    });
  } else {
    logger.error(new Error('Please provide a valid command'));
    process.exit(1);
  }
}
