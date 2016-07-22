const lodash = require('lodash');
const config = {
  src_folders: ['test/e2e/'],
  test_settings: {
    default: {
      launch_url: 'http://localhost:8080',
      filter: './test/e2e/*.spec.js',
      output_folder: false,
    },
  },
};

if (process.env.TRAVIS_JOB_NUMBER) {
  lodash.assign(config.test_settings.default, {
    selenium_port: 80,
    selenium_host: 'ondemand.saucelabs.com',
    username: process.env.SAUCE_USERNAME,
    access_key: process.env.SAUCE_ACCESS_KEY,
  });

  // construct multiple test_settings (aka environments)
  const defaultDesiredCapabilities = {
    build: `build-${process.env.TRAVIS_JOB_NUMBER}`,
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    tags: ['paperhive-widget'],
  };
  const browsers = {
    chrome: { browserName: 'chrome' },
  };
  lodash.forEach(browsers, (value, key) => {
    const desiredCapabilities = lodash.assign({}, defaultDesiredCapabilities, value);
    config.test_settings[key] = { desiredCapabilities };
  });
} else {
  config.selenium = {
    start_process: true,
    server_path: './node_modules/selenium-standalone/.selenium/selenium-server/2.53.1-server.jar',
    cli_args: {
      'webdriver.chrome.driver':
        './node_modules/selenium-standalone/.selenium/chromedriver/2.22-x64-chromedriver',
    },
  };
  config.test_settings.default.desiredCapabilities = {
    browserName: 'chrome',
    javascriptEnabled: true,
    acceptSslCerts: true,
  };
}

module.exports = config;
