// Karma configuration
// Generated on Tue Jun 06 2017 15:20:47 GMT-0400 (CLT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [

      'node_modules/jquery/dist/jquery.min.js',
      'www/lib/ionic/**/*.js',
      'www/lib/**/*.js',
      'www/js/modules/*.js',
      'www/js/modules/**/*.js',
      'www/templates/*.html',
      'www/js/endpoints/*.js',
      'www/js/translations/*.js',
      'www/js/global/*.js',
      'www/js/providers/*.js',
      'www/js/providers/**/*.js',
      'www/js/services/*.js',
      'www/js/services/**/*.js',
      'www/js/controllers/**/*.js',
      'www/tests/**/*.js'
  ],


    // list of files to exclude
    exclude: [
    ],



    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },

    plugins: [
      "karma-chrome-launcher",
      "karma-jasmine",
      "karma-mocha-reporter",
      "karma-ng-html2js-preprocessor"
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'www/templates/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates',
      stripPrefix: 'www/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
