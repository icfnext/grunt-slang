var exec = require('child_process').exec;
var path = require('path');
var request = require('request');
var fs = require('fs');

module.exports = function(grunt) {
    'use strict';

    grunt.registerMultiTask('slang', 'Push files to a running sling instance', function() {
        var srcWatch    = 'slang.'+this.target+'.sources',
            sources     = this.data.sources,
            options     = this.options(),
            config      = grunt.config,
            debug       = !!grunt.option('debug'),
            log         = grunt.log;
        log.writeflags(options, 'options');
        if(debug){
            log.writeflags(sources, 'sources');
        }

        function soThen(error, requestResponse, body) {
            log.debug('body = '+body);
            if(debug) log.writeflags(requestResponse);
            try{
                var body     = JSON.parse(body),
                    status   = body['status.code'] || -1,
                    message  = body['status.message'] || 'supposed to be body["status.message"]';
                if(error){
                    log.error('upload: '+status+' - '+message);
                }else{
                    log.subhead(body.title);
                    if(status === 200 || status === 201) {
                        log.ok('upload: '+status+' - '+message);
                    }else{
                        log.error('upload: '+status+' - '+message);
                    }
                }
            }catch(error){
                log.error('error - message = "'+error.message+', stack: '+error.stack)
            }
        }
        if(Array.isArray(sources) === true){
            var hostport = (options.protocol || 'http')+'://'+(options.host || 'localhost')+':'+(options.port || '4502'),
                username = options.user || 'admin',
                password = options.pass || 'admin';
            for(var i = 0, k = sources.length; i < k; i++) {
                var origin      = sources[i],
                    destination = path.dirname(origin),
                    postOptions = { formData: {}, headers: { 'Accept': 'application/json' }, url: '' },
                    prefixIndex = destination.indexOf('jcr_root/'),
                    isJrcRoot   = (prefixIndex !== -1);
                if(isJrcRoot){ // remove path part, jcr_root and before
                    destination = destination.substring(prefixIndex + 8);
                }
                log.debug('origin      = "'+origin+'"');
                log.debug('destination = "'+destination+'"');

                postOptions.formData = { '*': fs.createReadStream(origin), '@TypeHint': 'nt:file' };
                postOptions.url      = hostport+destination+'.json';
                if(debug) log.writeflags(postOptions, 'postOptions');
                
                log.debug('attempting upload of "'+origin+'" to "'+postOptions.url+'"');
                request.post(postOptions, soThen).auth(username, password).on('error', function() {
                    log.error('upload failed: ', error);
                });
            }
        }else{
            log.error('i was called to upload changes, but there are no array of changed file paths ... (doh).');
        }
        log.debug('srcWatch = '+srcWatch);
        config.set(srcWatch, []); // wipe changed source paths array
    });
};
