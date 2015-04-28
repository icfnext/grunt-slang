# grunt-slang

> Deploy modified files to AEM's CRX using the Apache Sling Post servlet

## Getting Started
To use this version of grunt-slang, add the following entry to the devDependencies section in your project's package.json

```json
"devDependencies": {
    "grunt-slang": "SchwaFa/grunt-slang"
  }
```
npm automatically translates "SchwaFa/grunt-slang" to the proper GitHub URL.

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
  }
```
