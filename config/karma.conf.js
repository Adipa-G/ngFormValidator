module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'test/lib/angular.1.4.1.js',
            'test/lib/angular-mocks.1.4.1.js',
            'src/ngFormValidator.1.4.1.0.js',
            'src/dateParser.0.0.0.1.js',
            'test/unit/validatorConfigurationSpec.js',
            'test/unit/validationTypesSpec.js',
            'test/unit/dateParserSpec.js'
        ],
        exclude: [

        ],
        preprocessors: {
            'src/*.js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: { type : 'html', subdir : 'coverage-report' },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['PhantomJS'],
        autoWatch: true,
        singleRun: true,
        /*browsers: ['Chrome'],
        singleRun: false,
        autoWatch: true,*/
        captureTimeout: 20000,
        reportSlowerThan: 500,
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-coverage'
        ]
    });
};
