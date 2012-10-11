module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: '<json:package.json>',

        meta: {
            banner:
                '/**\n' +
                ' * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
                ' * <%= pkg.homepage || pkg.repository.url %>\n' +
                ' *\n' +
                ' * Copyright © <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                ' * Released under the <%= _.pluck(pkg.licenses, "type").join(", ") %> <%= pkg.licenses.length > 1 ? "licenses" : "license" %>.\n' +
                ' */'
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

        qunit: {
            files: ['test/**/*.html']
        },

        lint: {
            files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
        },

        watch: {
            files: '<config:lint.files>',
            tasks: 'lint qunit'
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                browser: true,
                jquery: true
            },

            globals: {
                // Libraries
                Backbone: true, _: true,
                // AMD directives
                define: true
            }
        },

        uglify: {}
    });

    grunt.registerTask('default', 'lint qunit concat min');
};
