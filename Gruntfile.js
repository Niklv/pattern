var _ = require('lodash');
var path = require('path');
var js_app = [
    'source/js/app/const.js',
    'source/js/app/template.js',
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
];
var js_lib = [
    'node_modules/jade/runtime.js',
    'source/bower/jquery/dist/jquery.min.js',
    'source/js/jquery-ui-1.10.3.custom.js',
    'source/bower/FileSaver/FileSaver.js',
    'source/bower/json2/json2.js',
    'source/bower/lodash/dist/lodash.compat.min.js',
    'source/bower/backbone/backbone.js',
    'source/bower/bootstrap/dist/js/bootstrap.min.js',
    'source/bower/fabric/dist/fabric.min.js'
];

var i18n_config = {
    locales: 'source/locales/*.yaml',
    localeExtension: true,
    namespace: '$i'
};

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/**'],
            fonts: ['source/fonts/**']
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
        less: {
            production: {
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
            },
            debug: {
                options: {
                    paths: ["source/css"]
                },
                files: {
                    "build/css/lib.css": [
                        "source/bower/bootstrap/dist/css/bootstrap.css",
                        "source/bower/bootstrap/dist/css/bootstrap-theme.css"
                    ],
                    "build/css/app.css": [
                        "source/css/colorpicker2.less",
                        "source/css/app.less"
                    ],
                    "build/css/error.css": "source/css/error.less"
                }
            }
        },
        uglify: {
            production: {
                options: {
                    drop_console: true
                },
                files: {
                    'build/js/lib.min.js': js_lib,
                    'build/js/app.min.js': js_app
                }
            }
        },
        imagemin: {
            production: {
                options: {
                    optimizationLevel: 7,
                    pngquant: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'source/img/samples/',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'build/img/samples/'
                    },
                    {
                        expand: true,
                        cwd: 'source/img/',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'build/img/'
                    }
                ]
            },
            debug: {
                files: [
                    {
                        expand: true,
                        cwd: 'source/img/samples/',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'build/img/samples/'
                    },
                    {
                        expand: true,
                        cwd: 'source/img/',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'build/img/'
                    }
                ]
            }
        },
        compress: {
            production: {
                options: {
                    mode: 'gzip',
                    level: 9,
                    pretty: true
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*'],
                dest: 'build/',
                rename: function (base, path) {
                    return base + path + '.gz';
                }
            }
        },
        jade: {
            404: {
                options: {
                    data: {css: ['/css/error.css'], page: 404},
                    i18n: i18n_config
                },
                files: {
                    "build/404.html": ["source/view/error.jade"]
                }
            },
            500: {
                options: {
                    data: {css: ['/css/error.css'], page: 500},
                    i18n: i18n_config
                },
                files: {
                    "build/500.html": ["source/view/error.jade"]
                }
            },
            js_templates: {
                options: {
                    client: true,
                    namespace: "templates",
                    processName: function (name) {
                        return path.basename(name, path.extname(name))
                    },
                    debug: false
                },
                files: {
                    "source/js/app/template.js": [
                        "source/view/library_item.jade",
                        "source/view/part_settings_tab_header.jade",
                        "source/view/part_settings.jade"
                    ]
                }
            },
            production: {
                options: {
                    debug: false,
                    data: {
                        js: ['js/lib.min.js', 'js/app.min.js'],
                        css: ['css/app.min.css']
                    },
                    i18n: i18n_config
                },
                files: {
                    "build/index.html": ["source/view/index.jade"]
                }
            }
        },
        yaml: {
            locales: {
                options: {},
                files: [{
                    expand: true,
                    cwd: 'source/locales',
                    src: ['*.yaml'],
                    dest: 'build/locale'
                }]
            }

        }
        /*,
         watch: {
         options: {
         livereload: true
         },
         js: {
         files: {}
         },
         style: {
         files: {}
         },
         html: {
         files: {}
         }
         }*/
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jade-i18n');
    /*grunt.registerTask('copy_fonts', [
     'clean:fonts',
     'copy:bootstrap',
     'copy:font_awesome'
     ]);
     grunt.registerTask('default', [
     'clean:build',
     'copy',
     'less:production',
     'jade:js_templates',
     'jade:production',
     'uglify:production',
     'imagemin:production',
     'compress:production'
     ]);*/
    //grunt.registerTask('dbg', ['clean:build', 'copy', 'jade', 'less:dbg', 'concat:lib', 'concat:app', 'imagemin:dbg', 'watch:js']);
};