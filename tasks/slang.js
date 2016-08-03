var exec = require('child_process').exec;
var path = require('path');
var request = require('request');
var fs = require('fs');

module.exports = function(grunt) {
    'use strict';

    grunt.registerMultiTask('slang', 'Push files to a running sling instance', function() {
        var localPath = this.data.src;
        var options = this.options();
        var log = grunt.log;
        var destPath,
            requestOptions;

        var HOST = options.host || 'localhost';
        var PORT = options.port || 4502;
        var USER = options.user || 'admin';
        var PASS = options.pass || 'admin';
        var CONTEXT = options.context;

        // if jcr_root is in file system path, remove before setting destination
        destPath = localPath;
        if (path.dirname(destPath).indexOf('jcr_root/') !== -1) {
            destPath = destPath.substring(path.dirname(destPath)
                .indexOf('jcr_root/') + 9);
        }

        // create full URL for curl path
        var URL = 'http://' + USER + ':' + PASS + '@' + HOST + ':' + PORT + '/' +
                  (CONTEXT ?  CONTEXT + '/' : '') + path.dirname(destPath) + '.json';

        requestOptions = {
            url: URL,
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        }

        function optionalCallback(err, httpResponse, responseBody) {
            if (err) {
                log.error('File Upload Failed');
            }

            try {
                var response = JSON.parse(responseBody);

                var status = response['status.code'] ? response['status.code'] : 201;
                var message = response['status.message'] ? response['status.message'] : 'File Created';
                var location = response['location'] ? response['location'] : destPath;

                if (status === 200 || status === 201) {
                    log.writeln('File Upload Successful on port ' + PORT + ' : ' + status + ' - ' + message);
                    log.writeln('Uploaded to: ' + location);
                } else {
                    log.error('File Upload Failed: ' + status + ' - ' + message);
                }
            } catch(err) {
                log.error('File Upload Failed - Check Username and Password');
            }
        }

        var r = request(requestOptions, optionalCallback).auth(USER, PASS);

        var form = r.form();

        form.append('*', fs.createReadStream(localPath));
        form.append('@TypeHint', 'nt:file');
    });
};
