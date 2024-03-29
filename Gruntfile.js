module.exports = function(grunt) {

    require('time-grunt')(grunt);

    // Grunt Config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'dist'
                    ]
                }]
            }
        },
        concat: {
            basic_and_extras: {
                files: {
                    'dist/ngFormValidator.js': ['src/ngFormValidator.js']
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dist/ngFormValidator.js': ['dist/ngFormValidator.js']
                }
            }
        },
        jsbeautifier: {
            files: ['*.js', 'src/**/*.js'],
            options: {}
        },
        jshint: {
            all: ['*.js', 'src/**/*.js'],
            options: {
                quotmark: 'single'
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: ['index.html', 'demo/**', 'dist/ngFormValidator.js']
                },
                options: {
                    host: 'localhost',
                    ports: {
                        min: 8000,
                        max: 8100
                    },
                    server: {
                        baseDir: '.'
                    },
                    watchTask: true
                }
            }
        },
        watch: {
            files: ['src/*.js'],
            tasks: ['build'],
            options: {
                spawn: false,
                interrupt: true
            }
        },
        karma: {
            ngFormValidator: {
                configFile: 'config/karma.conf.js'
            }
        },
        coverage: {
            default: {
                options: {
                    thresholds: {
                        'statements': 90,
                        'branches': 90,
                        'lines': 90,
                        'functions': 90
                    },
                    dir: 'coverage',
                    root: 'test'
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    // Register Task
    grunt.registerTask('dev', ['browserSync', 'watch']);
    grunt.registerTask('build', ['clean', 'concat', 'uglify']);
    grunt.registerTask('check', ['jshint', 'jsbeautifier', 'build']); // use this before commit
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['build', 'check', 'test']);
};
