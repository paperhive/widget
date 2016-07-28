'use strict';
const utils = require('./utils');

module.exports = {
  before: done => utils.startServer().then(done),
  after: done => utils.stopServer().then(done),
  // the name is overwritten if it is specified in nightwatch.conf.js
  desiredCapabilities: {
    name: 'PaperHive widget (iframe and script)',
  },
  'doi of iframe exists': browser => {
    browser
      .url(`${browser.launch_url}#type=doi&id=10.1016/j.neurobiolaging.2016.04.004`)
      .waitForElementVisible('.ph-widget', 5000)
      .assert.title('PaperHive widget')
      .assert.elementPresent('img')
      .assert.elementPresent('.ph-badge')
      .assert.elementPresent('h1')
      .assert.containsText('h1 > a', 'Read and discuss on PaperHive');
    browser.expect.element('.ph-description > small').text.to.match(/\d+ discussions?/);
    browser.expect.element('.ph-description > small').text.to.match(/\d+ hives?/);
    browser.end();
  },
  'doi of iframe does not exist': browser => {
    browser
    .url(`${browser.launch_url}#type=doi&id=doesnotexist`)
    .waitForElementNotPresent('.ph-widget', 5000)
    .end();
  },
  'doi (of script resp. div) exists': browser => {
    browser
      .url(`${browser.launch_url}/index.script.html`)
      .waitForElementVisible('#validDoi', 5000)
      .assert.elementPresent('#validDoi img')
      .assert.elementPresent('#validDoi .ph-badge')
      .assert.elementPresent('#validDoi h1')
      .assert.containsText('#validDoi h1 > a', 'Read and discuss on PaperHive');
    browser.expect.element('#validDoi .ph-description > small').text.to.match(/\d+ discussions?/);
    browser.expect.element('#validDoi .ph-description > small').text.to.match(/\d+ hives?/);
    browser.end();
  },
  'doi (of script resp. div) does not exist': browser => {
    browser
      .url(`${browser.launch_url}/index.script.html`)
      .waitForElementPresent('#invalidDoi', 5000)
      .assert.elementNotPresent('#invalidDoi img')
      .assert.elementNotPresent('#invalidDoi .ph-badge')
      .assert.elementNotPresent('#invalidDoi h1')
      .end();
  },
};
