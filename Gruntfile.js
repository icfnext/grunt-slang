var slang = require('./tasks/slang');
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        slang: {
            author: {
                options: {
                    port: grunt.option('port') || 4502
                }
            }
        },
        watch: {
            test: {
                files: ['etc/**/*.{css,html,js,jsp,less,sass,scss,txt}'],
                tasks: ['slang'],
                options: {
                    spawn: false
                }
            }
        }
    });

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.config.set(['slang', 'author', 'src'], filepath);
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};
