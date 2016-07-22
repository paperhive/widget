'use strict';
const utils = require('./utils');

module.exports = {
  before: done => utils.startServer().then(done),
  after: done => utils.stopServer().then(done),
  // the name is overwritten if it is specified in nightwatch.conf.js
  desiredCapabilities: {
    name: 'PaperHive widget',
  },
  'doi exists': browser => {
    browser
      .url(`${browser.launch_url}#type=doi&id=10.1016/j.neurobiolaging.2016.04.004`)
      .waitForElementVisible('.ph-widget', 2000)
      .assert.title('PaperHive widget')
      .assert.elementPresent('img')
      .assert.elementPresent('.ph-badge')
      .assert.elementPresent('h1')
      .assert.containsText('h1 > a', 'Read and discuss on PaperHive');
    browser.expect.element('.ph-description > small').text.to.match(/\d+ discussions?/);
    browser.expect.element('.ph-description > small').text.to.match(/\d+ hives?/);
    browser.end();
  },
  'doi does not exist': browser => {
    browser
      .url(`${browser.launch_url}#type=doi&id=doesntexist`)
      .waitForElementNotPresent('.ph-widget', 1000)
      .end();
  },
};
