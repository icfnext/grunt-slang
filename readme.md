# grunt-slang

> Deploy modified files to AEM's CRX using the Apache Sling Post servlet

## Slang Task

### Usage Example
```js
slang: {
  // AEM author configuration
  author: {
   	options: {
   	  host: 'dev.example.com',
   	  port: '4502',
   	  ignorePaths: true
   	}
  },
  // AEM publish configuration
  publish: {
  	options: {
  	  host: 'dev.example.com',
  	  port: '4503',
  	  ignorePaths: true
    }
  }
},
watch: {
	// watch task for AEM author
	author: {
    files: ['<%= pathTo.projectDesign %>**/*.{css,html,js,jsp,txt}'],
		tasks: ['slang:author'],
		options: {
			spawn: false
	  }
	},
	// watch task for AEM publish
	publish: {
	  files: ['<%= pathTo.projectDesign %>**/*.{css,html,js,jsp,txt}'],
		  tasks: ['slang:publish'],
		  options: {
		    spawn: false
		  }
  }
}
```
You also need to set the path to the modified file on every watch event, since we only want to upload modified files/folders and not everything:

```
// we only want to grunt-slang the modified file(s) to AEM, not all files
grunt.event.on('watch', function(action, filepath) {
    var config         = grunt.config,
        log            = grunt.log,
        authorSources  = Array.isArray(config.get('slang.author.sources')) ? config.get('slang.author.sources') : [],
        publishSources = Array.isArray(config.get('slang.publish.sources')) ? config.get('slang.publish.sources') : [];
    log.debug('event: watch: action   = ' + action);
    log.debug('event: watch: filepath = ' + filepath);

    authorSources.push(filepath);
    publishSources.push(filepath);

    config.set('slang.author.sources', authorSources);
    config.set('slang.publish.sources', publishSources);
});
```
