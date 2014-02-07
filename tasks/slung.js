'use strict';
var exec = require('child_process').exec;
var path = require('path');

module.exports = function(grunt) {

  // This array will be used to cache the paths to avoid attempting to sling the same directory multiple times.
  var checkedPaths = [];

  grunt.registerMultiTask('slung', 'Push files to a running sling instance', function() {
    var localPath = this.data.src,
        options = this.options({
          stdout: false,
          host: 'localhost',
          port: '4502',
          user: 'admin',
          pass: 'admin'
        }),
        destPath;

        // checking if local path has jcr_root and stripping it and everything before it off
        if (path.dirname(localPath).indexOf('jcr_root/') !== -1) {
          destPath = localPath.substring(path.dirname(localPath).indexOf('jcr_root/') + 9);
        } else {
          destPath = localPath;
        }

    // piecing together the curl command to push the file to sling
    var slingFile = function slingFile(path) {
      var command = 'curl -i -X POST -F';
          command += path.file + '=@' + localPath;
          command += ' -u ' + options.user + ':' + options.pass;
          command += ' http://' + options.host + ':' + options.port + path.path;

      grunt.log.writeln('file: ' + localPath);
      grunt.log.writeln('slung to: ' + path.path + '/' + path.file);

      exec(command, function (error, stdout, stderr) {
        if (error !== null) {
          grunt.verbose.writeln('exec error: ' + error);
        } else {
          grunt.verbose.writeln('Response: ' + stdout);
        }
      });
    };

    //piecing together the curl command to push the folders to sling
    var slingFolder = function slingFolder(path) {
      var command = 'curl -i -X POST -F"jcr:primaryType=nt:folder" -u ' + options.user + ':' + options.pass + ' http://' + options.host + ':' + options.port + path;
      grunt.verbose.writeln('command: ' + command);

      exec(command, function (error, stdout, stderr) {
        if (error !== null) {
          grunt.verbose.writeln('exec error: ' + error);
        } else {
          grunt.verbose.writeln('Response: ' + stdout);
        }
      });
    };

    // Parses the cleaned up path and calls the appropriate sling function defined above on new paths.
    function pathBuilder ( path ) {
    
      var aPath,   // stores the path as an array split on the slash
      newPath = '', // stores the new path tree as it gets built
      filePath = ''; // use for file creation
    
      if ( path.substr(0,1) === '/' ) {
        path = path.substr(1);
      }
    
      aPath = path.split('/');
    
      // loop through the items
      for (var n=0; n<aPath.length; n++) {
    
        // check for file
        if ( n === aPath.length - 1 && aPath[n].indexOf('.') > -1 ) {
    
          filePath = ( newPath === '' ) ? '/' : newPath;
    
          // call the method to create the file and pass it the filename and the path (which we got in the previous iteration)
          slingFile( {file: aPath[n], path: filePath} );
    
        // otherwise create directory structure
        } else {
    
          // append the current path with a leading slash...
          newPath += '/' + aPath[n];
    
          if ( checkedPaths.indexOf(newPath) < 0 ) {
            checkedPaths.push(newPath);
    
            // make the folder
            slingFolder(newPath);
    
          }
        }
      }
    }

    pathBuilder(destPath);
    
  });
};