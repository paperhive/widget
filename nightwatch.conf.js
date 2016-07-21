const lodash = require('lodash');
const config = {
  src_folders: ['test/e2e/'],
  test_settings: {
    default: {
      launch_url: 'http://localhost:8080',
      filter: './test/e2e/*.spec.js',
      output_folder: false,
      /*
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      screenshots: {
        enabled: false,
        path: ''
      },
      */
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
      },
    },
  },
};

if (process.env.TRAVIS_JOB_NUMBER) {
  lodash.assign(config.test_settings, {
    launch_url: 'http://ondemand.saucelabs.com:80',
    selenium_port: 80,
    selenium_host: 'ondemand.saucelabs.com',
    username: process.env.SAUCE_USERNAME,
    access_key: process.env.SAUCE_ACCESS_KEY,
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
}

module.exports = config;
