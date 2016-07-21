module.exports = {
  src_folders: ['test/e2e/'],
  selenium: {
    start_process: true,
    server_path: './node_modules/selenium-standalone/.selenium/selenium-server/2.53.1-server.jar',
    /*
    log_path: '',
    host: "127.0.0.1",
    port: 4444,
    */
    cli_args: {
      'webdriver.chrome.driver':
        './node_modules/selenium-standalone/.selenium/chromedriver/2.22-x64-chromedriver',
    },
  },
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
