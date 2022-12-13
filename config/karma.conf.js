module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'test/lib/angular.js',
            'test/lib/angular-mocks.js',
            'src/ngFormValidator.js',
            'test/unit/validatorConfigurationSpec.js',
            'test/unit/validationTypesSpec.js'
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
        /*browsers: ['PhantomJS'],
        autoWatch: true,
        singleRun: true,*/
        browsers: ['ChromeHeadless'],
        singleRun: true,
        autoWatch: true,
        captureTimeout: 20000,
        reportSlowerThan: 500,
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-coverage'
        ]
    });
};
