module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: 'build/*'
            },
            fonts: {
                src: 'source/fonts/*'
            }
        },
        copy: {
            bootstrap: {
                cwd: 'source/bower/bootstrap/fonts/',
                src: '**',
                dest: 'source/fonts/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            font_awesome: {
                cwd: 'source/bower/font-awesome/fonts/',
                src: '**',
                dest: 'source/fonts/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            fonts_dist: {
                cwd: 'source/fonts/',
                src: '**',
                dest: 'build/fonts/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            img_calculated_dist: {
                cwd: 'source/img/calculated/',
                src: '**',
                dest: 'build/img/calculated/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            img_samples_dist: {
                cwd: 'source/img/samples/',
                src: '**',
                dest: 'build/img/samples/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            favicon_dist: {
                cwd: 'source/',
                src: 'favicon.ico',
                dest: 'build/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            tgif_dist: {
                cwd: 'source/img/',
                src: 't.gif',
                dest: 'build/img/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            }
        },
        processhtml: {
            index: {
                files: {
                    'build/index.html': 'source/index.html',
                    'build/404.html': 'source/404.html',
                    'build/500.html': 'source/500.html'
                }
            }
        },
        htmlmin: {
            index: {
                options: {
                    removeComments: true,
                    removeEmptyAttributes: true,
                    collapseWhitespace: true,
                    useShortDoctype: true
                },
                files: {
                    'build/index.html': 'build/index.html',
                    'build/404.html': 'build/404.html',
                    'build/500.html': 'build/500.html'
                }
            }
        },
        less: {
            dist: {
                options: {
                    paths: ["source/css"],
                    cleancss: {
                        keepSpecialComments: 0
                    },
                    compress: true
                },
                files: {
                    "build/css/app.min.css": [
                        "source/bower/bootstrap/dist/css/bootstrap.css",
                        "source/bower/bootstrap/dist/css/bootstrap-theme.css",
                        "source/css/colorpicker2.less",
                        "source/css/app.less"
                    ],
                    "build/css/error.min.css": "source/css/error.less"
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    /*mangle: {
                     except: ['jQuery', 'Backbone']
                     },*/
                    drop_console: true
                },
                files: {
                    'build/js/app.min.js': [
                        'source/bower/jquery/dist/jquery.min.js',
                        'source/js/jquery-ui-1.10.3.custom.js',
                        'source/bower/FileSaver/FileSaver.js',
                        'source/bower/json2/json2.js',
                        'source/bower/underscore/underscore.js',
                        'source/bower/backbone/backbone.js',
                        'source/bower/bootstrap/dist/js/bootstrap.min.js',
                        'source/bower/fabric/dist/fabric.min.js',
                        'source/js/app/const.js',
                        'source/js/app/utils.js',
                        'source/js/app/slider.js',
                        'source/js/app/canvas.js',
                        'source/js/app/colorpicker/model.js',
                        'source/js/app/colorpicker/view.js',
                        'source/js/app/sample/view.js',
                        'source/js/app/sample/model.js',
                        'source/js/app/sample/collection.js',
                        'source/js/app/library/model.js',
                        'source/js/app/library/view.js',
                        'source/js/app/library/collection.js',
                        'source/js/app/ui-handlers.js',
                        'source/js/app/app.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.registerTask('copy fonts', ['clean:fonts', 'copy:bootstrap', 'copy:font_awesome']);
    grunt.registerTask('default', ['clean:build', 'copy', 'processhtml:index', 'htmlmin:index', 'less:dist', 'uglify:dist']);
};
