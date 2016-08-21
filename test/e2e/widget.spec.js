'use strict';
const assert = require('assert');
const utils = require('./utils');

module.exports = {
  before: done => utils.startServer().then(done),
  after: done => utils.stopServer().then(done),
  // the name is overwritten if it is specified in nightwatch.conf.js
  desiredCapabilities: {
    name: 'PaperHive widget (iframe and script)',
  },
  'iframe (doi exists)': browser => {
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
  'iframe (doi does not exist)': browser => {
    browser
    .url(`${browser.launch_url}#type=doi&id=doesnotexist`)
    .waitForElementNotPresent('.ph-widget', 5000)
    .end();
  },
  // nightwatch can not yet test elements inside shadow DOM, see:
  // (https://github.com/nightwatchjs/nightwatch/issues/192)
  'script (doi exists)': browser => {
    let shadowDom;
    browser
      .url(`${browser.launch_url}/index.script.html`)
      .waitForElementVisible('#validDoi', 5000)
      .execute(function testShadowDOM() {
        return document.body.createShadowRoot !== undefined;
      }, [], result => { shadowDom = result.value; })
      .perform(function testShadowOrIframe() {
        if (shadowDom) {
          utils.testShadowHTML(browser, 'validDoi', 'img',
            html => assert(/img class="ph-logo"/.test(html)));
          utils.testShadowHTML(browser, 'validDoi', '.ph-badge',
            html => assert(html.length > 0));
          utils.testShadowHTML(browser, 'validDoi', 'h1 > a',
            html => assert(/Read and discuss on PaperHive/.test(html)));
          utils.testShadowHTML(browser, 'validDoi', '.ph-description > small',
            html => {
              assert(/\d+ discussions?/.test(html));
              assert(/\d+ hives?/.test(html));
            });
        } else {
          browser
            .assert.elementPresent('#validDoi > iframe')
            // check if right source is loaded
            .assert.attributeEquals('#validDoi > iframe', 'src', 'https://paperhive.org/widget/#type=doi&id=10.1016/j.neurobiolaging.2016.04.004');
        }
      });
    browser.end();
  },

  // implement for shadow and non-shadow browsers (see above)
  'script (doi does not exist)': browser => {
    let shadowDom;
    browser
      .url(`${browser.launch_url}/index.script.html`)
      .waitForElementPresent('#invalidDoi', 5000)
      .execute(function testShadowDOM() {
        return document.body.createShadowRoot !== undefined;
      }, [], result => { shadowDom = result.value; })
      .perform(function testShadowOrIframe() {
        if (shadowDom) {
          browser
            .assert.elementNotPresent('#invalidDoi img')
            .assert.elementNotPresent('#invalidDoi .ph-badge')
            .assert.elementNotPresent('#invalidDoi h1');
        } else {
          browser.assert.elementNotPresent('#invalidDoi > iframe');
        }
      });
    browser.end();
  },
};
