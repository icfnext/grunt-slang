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
// we only want to upload the modified file to AEM, not all files
grunt.event.on('watch', function(action, filepath) {
 	grunt.config.set('slang.author.src', filepath);
 	grunt.config.set('slang.publish.src', filepath);
});
```
