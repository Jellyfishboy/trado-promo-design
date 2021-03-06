'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt, {config: 'package.json'});
    grunt.loadNpmTasks('assemble');
    require('time-grunt')(grunt);

    var tradoPromoConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        trado_promo: tradoPromoConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            concatJavascript: {
                files: ['<%= trado_promo.app %>/js/{,*/}*.js'],
                tasks: ['concat:javascripts']
            },
            compass: {
                files: ['<%= trado_promo.app %>/src/sass/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'concat:stylesheets']
            },
            assemble: {
                files: ['<%= trado_promo.app %>/layouts/*.hbs', 'app/pages/{,*/}*.hbs', 'app/partials/**/*.hbs'],
                tasks: ['assemble']
            },
            // img: {
            //     files: ['<%= trado_promo.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'],
            //     options: {
            //         livereload: true
            //     }
            // }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'app'),
                            lrSnippet
                        ];
                    }
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= trado_promo.app %>/*.html',
                        '<%= trado_promo.app %>/sitemap.xml',
                        '<%= trado_promo.app %>/css',
                        '<%= trado_promo.app %>/js/trado-promo.js',
                        '<%= trado_promo.dist %>/*',
                        '!<%= trado_promo.dist %>/.git*'
                    ]
                }]
            },
            dist_folder: {
                files: [{
                    src: [
                        '<%= trado_promo.dist %>/*'
                    ]
                }]
            },
            server: {
                files: [{
                    src: [
                        '<%= trado_promo.app %>/*.html',
                        '<%= trado_promo.app %>/sitemap.xml',
                        '<%= trado_promo.app %>/css',
                        '<%= trado_promo.app %>/js/trado-promo.js',
                        '<%= trado_promo.dist %>/*'
                    ]
                }]
            },
            css: {
                files: [{
                    src: [
                        '<%= trado_promo.dist %>/css/trado-promo.css'
                    ]
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= trado_promo.app %>',
                    dest: '<%= trado_promo.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '*.html',
                        'img/*',
                        'sitemap.xml'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= trado_promo.app %>/css',
                dest: '<%= trado_promo.dist %>/css/',
                src: '{,*/}*.css'
            },
            javascripts: {
                expand: true,
                cwd: '<%= trado_promo.app %>/js',
                dest: '<%= trado_promo.dist %>/js/',
                src: '*.js'
            },
            modernizr:
            {
                expand: true,
                cwd: '<%= trado_promo.app %>/components/modernizr',
                dest: '<%= trado_promo.dist %>/components/modernizr',
                src: 'modernizr.js'
            },
            fontawesome:
            {
                expand: true,
                cwd: '<%= trado_promo.app %>/components/font-awesome/fonts',
                dest: '<%= trado_promo.dist %>/fonts',
                src: '*'
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        compass: {
            options: {
                sassDir: '<%= trado_promo.app %>/src/sass',
                cssDir: '<%= trado_promo.app %>/css',
                outputStyle: 'nested',
                imagesDir: '<%= trado_promo.app %>/img',
                imagesPath: '<%= trado_promo.app %>/img',
                httpGeneratedImagesPath: 'https://dlczmkt02tnnw.cloudfront.net/trado-promo/assets/img',
                httpImagesPath: 'https://dlczmkt02tnnw.cloudfront.net/trado-promo/assets/img',
                relative_assets: false
            },
            dist: {
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        concat: {
            javascripts: {
                options: {
                  separator: ';'
                },
                src: [
                    '<%= trado_promo.app %>/components/ajaxchimp/jquery.ajaxchimp.js',
                    '<%= trado_promo.app %>/components/bouncefix.js/dist/bouncefix.js',
                    '<%= trado_promo.app %>/components/slicknav/dist/jquery.slicknav.js',
                    '<%= trado_promo.app %>/components/theia-sticky-sidebar/js/theia-sticky-sidebar.js',
                    '<%= trado_promo.app %>/components/featherlight/release/featherlight.min.js',
                    '<%= trado_promo.app %>/components/jquery-validation/dist/jquery.validate.min.js'
                ],
                dest: '<%= trado_promo.app %>/js/trado-promo.js',
            },
            stylesheets: {
                options: {
                    separator: ''
                },
                src: [
                    '<%= trado_promo.app %>/components/normalize-css/normalize.css',
                    '<%= trado_promo.app %>/components/bootstrap/dist/css/bootstrap.min.css',
                    '<%= trado_promo.app %>/components/font-awesome/css/font-awesome.min.css',
                    '<%= trado_promo.app %>/components/slicknav/dist/slicknav.css',
                    '<%= trado_promo.app %>/components/featherlight/release/featherlight.min.css',
                    '<%= trado_promo.app %>/css/trado-promo.css'
                ],
                dest: '<%= trado_promo.app %>/css/trado-promo.css'
            }
        },
        uglify: {
            options: {
              mangle: true
            },
            dist: {
                files: {
                    '<%= trado_promo.dist %>/js/application.js': [ '<%= trado_promo.dist %>/js/application.js' ],
                    '<%= trado_promo.dist %>/js/trado-promo.js': [ '<%= trado_promo.dist %>/js/trado-promo.js' ],
                    '<%= trado_promo.dist %>/components/modernizr/modernizr.js' : ['<%= trado_promo.dist %>/components/modernizr/modernizr.js']
                }
            }
        },
        assemble: {
            options: {
                layoutdir: "app/layouts",
                partials: "app/partials/**/*.hbs",
                flatten: true,
                plugins: ['grunt-assemble-sitemap'],
                sitemap: {
                    homepage: 'http://www.trado.io',
                    changefreq: 'weekly',
                    priority: '1',
                    exclude: ['50x'],
                    robot: false,
                    relativedest: true
                },
            },
            application: {
                options: {
                    layout: 'application.hbs'
                },
                src: ['app/pages/application/*.hbs'],
                dest: 'app/.'
            },
            home: {
                options: {
                    layout: 'home.hbs'
                },
                src: ['app/pages/home/*.hbs'],
                dest: 'app/.'
            }
        },
        cssmin: {
            add_banner: {
                options: {
                    banner: '/* Compiled Trado promotional stylesheet assets */'
                },
                files: {
                    '<%= trado_promo.dist %>/css/trado-promo.css': ['<%= trado_promo.dist %>/css/trado-promo.css']
                }
            }
        },
        cdnify: {
            dist: {
                options: {
                    base: 'https://dlczmkt02tnnw.cloudfront.net/trado-promo/assets/',
                    html: {
                        'link[rel=icon]' : 'href'
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: '**/*.{css,html}',
                    dest: 'dist'
                }]
            }
        },
        htmlbuild: {
            dist: {
                src: '<%= trado_promo.dist %>/*.html',
                dest: '<%= trado_promo.dist %>/'
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        grunt.task.run([
            'clean:server',
            'compass:server',
            'concat:javascripts',
            'concat:stylesheets',
            'assemble:application',
            'assemble:home',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });
    grunt.registerTask('build', [
        'clean:dist',
        'compass:dist',
        'concat:javascripts',
        'concat:stylesheets',
        'assemble:application',
        'assemble:home',
        'copy:styles',
        'cssmin',
        'copy:javascripts',
        'copy:modernizr',
        'copy:fontawesome',
        'uglify:dist',
        'copy:dist',
        'cdnify:dist',
        'htmlbuild:dist'
    ]);
    grunt.registerTask('clean-dist', [
        'clean:dist_folder'
    ]);
};