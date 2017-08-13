import childProcess from 'child_process';

let server = null;

export default async (serverPath) => {
  return new Promise((resolve, reject) => {
    var resolvePending = true;
    if (server) server.kill('SIGTERM');
    server = childProcess.spawn('node', [serverPath], {
      env: Object.assign({ NODE_ENV: 'development' }, process.env),
      silent: false
    });

    server.stdout.on('data', handleStdOut);
    server.stderr.on('data', (err) => process.stderr.write(err));
    if (resolvePending) {
      server.once('exit', (code, signal) => {
        if (resolvePending) reject(new Error(`Server terminated unexpectedly with code: ${code} signal: ${signal}`));
      });
    }
    function handleStdOut(data) {
      process.stdout.write(data);
      const time = new Date().toTimeString();
      const match = data.toString('utf8').match(/The server is running at http:\/\/(.*?)\//);
      process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '[$1] '));
      process.stdout.write(data);
      if (!!match) {
        server.stdout.removeListener('data', handleStdOut);
        server.stdout.on('data', (data) => process.stdout.write(data));
        resolvePending = false;
        resolve(match[1]);
      }
    };
  });
};

process.on('exit', () => {
  if (server) server.kill('SIGTERM');
});
