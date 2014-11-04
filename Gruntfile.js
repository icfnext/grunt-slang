'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      test: {
        files: ['etc/**/*.{css,html,js,jsp,less,sass,scss,txt}'],
        tasks: ['slang'],
        options: {
          spawn: false,
        },
      }
    }
  });

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.config.set(['slang', 'test', 'src'], filepath);
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'slang'
  ]);

};
