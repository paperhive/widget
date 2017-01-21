'use strict';

module.exports.testShadowHTML = function testShadowHTML(browser, shadowId, selector, test) {
  browser.execute(
    `return document.getElementById('${shadowId}')
      .shadowRoot.querySelector('${selector}').outerHTML;`,
    [],
    result => {
      if (result.error) throw new Error(result.error);
      test(result.value);
    }
  );
};
