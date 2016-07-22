'use strict';
const utils = require('./utils');

module.exports = {
  before: done => utils.startServer().then(done),
  after: done => utils.stopServer().then(done),
  // the name is overwritten if it is specified in nightwatch.conf.js
  desiredCapabilities: {
    name: 'PaperHive widget',
    passed: true,
  },
  doiExists: browser => {
    browser
      .url(`${browser.launch_url}#type=doi&id=10.1016/j.neurobiolaging.2016.04.004`)
      .assert.title('PaperHive widgett')
      .end();
  },
};
