module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: '<json:package.json>',

        meta: {
            banner: grunt.file.read('build/banner.js')
        },

        concat: {
            modelbinder: {
                src: ['<banner:meta.banner>', '<file_strip_banner:src/backbone.modelbinder.js>'],
                dest: 'dist/backbone.modelbinder.js'
            },

            collectionbinder: {
                src: ['<banner:meta.banner>', '<file_strip_banner:src/backbone.collectionbinder.js>'],
                dest: 'dist/backbone.collectionbinder.js'
            }
        },

        min: {
            modelbinder: {
                src: ['<banner:meta.banner>', '<config:concat.modelbinder.dest>'],
                dest: 'dist/backbone.modelbinder.min.js'
            },

            collectionbinder: {
                src: ['<banner:meta.banner>', '<config:concat.collectionbinder.dest>'],
                dest: 'dist/backbone.collectionbinder.min.js'
            }
        },

        jasmine: {
            all: ['specs/SpecRunner.html']
        },

        lint: {
            files: ['grunt.js', 'src/**/*.js']
        },

        watch: {
            files: '<config:lint.files>',
            tasks: 'lint jasmine'
        },

        jshint: {
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: false,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                plusplus: false,
                quotmark: 'single',
                regexp: true,
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                maxparams: 4,
                maxdepth: 3,
                maxstatements: 10,
                maxcomplexity: 5,

                browser: true,
                jquery: true,
                node: true
            },

            globals: {
                // Libraries
                _: true,
                Backbone: true,
                // AMD directives
                define: true
            }
        },

        uglify: {}
    });

    grunt.loadNpmTasks('grunt-jasmine-task');

    grunt.registerTask('default', 'lint jasmine concat min');
};
