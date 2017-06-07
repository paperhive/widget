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
  // disable parallel tests because they create problems on travis/saucelabs
  test_workers: false,
  selenium: {
    start_process: false,
  },
};

if (process.env.TRAVIS_JOB_NUMBER) {
  lodash.assign(config.test_settings.default, {
    selenium_port: 443,
    selenium_host: 'ondemand.saucelabs.com',
    use_ssl: true,
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
    android: {
      browserName: 'Browser',
      deviceName: 'Android Emulator',
      platformVersion: '5.1',
      platformName: 'Android',
    },
    chrome: { browserName: 'chrome', version: 'latest', platform: 'Windows 10' },
    edge: { browserName: 'MicrosoftEdge', version: 'latest', platform: 'Windows 10' },
    firefox: { browserName: 'firefox', version: 'latest', platform: 'Windows 10' },
    ie: { browserName: 'internet explorer', version: 'latest', platform: 'Windows 10' },
    safari: { browserName: 'safari', version: 'latest', platform: 'OS X 10.11' },
    safariIOS: {
      browserName: 'Safari',
      deviceName: 'iPhone 7 Simulator',
      platformVersion: '10.0',
      platformName: 'iOS',
    },
  };
  lodash.forEach(browsers, (value, key) => {
    const desiredCapabilities = lodash.assign({}, defaultDesiredCapabilities, value);
    config.test_settings[key] = { desiredCapabilities };
  });
} else {
  config.selenium = {
    start_process: true,
    server_path: './node_modules/selenium-standalone/.selenium/selenium-server/3.4.0-server.jar',
    cli_args: {
      'webdriver.chrome.driver':
        './node_modules/selenium-standalone/.selenium/chromedriver/2.29-x64-chromedriver',
      'webdriver.gecko.driver': './node_modules/selenium-standalone/.selenium/geckodriver/0.16.0-x64-geckodriver',
    },
  };
  config.test_settings.default.desiredCapabilities = {
    browserName: 'chrome', // e.g. chrome, firefox
    // marionette: true, // for firefox
    javascriptEnabled: true,
    acceptSslCerts: true,
  };
}

module.exports = config;
