'use strict';
const liveServer = require('live-server');

let server;
module.exports.startServer = () => {
  server = liveServer.start({
    root: 'build/',
    port: 8080,
    open: false,
    mount: [['/index.script.html', 'test/e2e/index.script.html']],
    watch: ['non-existing'],
    logLevel: 0,
  });
  return new Promise((resolve, reject) => {
    server.addListener('listening', resolve);
    server.addListener('error', reject);
  });
};

module.exports.stopServer = () => new Promise((resolve, reject) => {
  server.close(err => {
    if (err) return reject(err);
    return resolve();
  });
});
