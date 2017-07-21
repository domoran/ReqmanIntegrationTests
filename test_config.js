// conf.js
exports.config = {
  framework: 'jasmine',

  seleniumAddress: 'http://localhost:4445/wd/hub',

  suites: {
    configure: 'src/test/CONFIGURE.js',
    
    deb: 'src/test/INT_DEBUGTEST.js',

    api: 'src/test/test_api.js',
    
    teardown: 'src/test/INT_TEARDOWN.js',

    integration: [
    	'src/test/INT_TEARDOWN.js',
    	'src/test/INT_PREPARATION.js',
    	'src/test/INT_TEST001.js',
    	'src/test/INT_TEST002.js',
    	'src/test/INT_TEST003.js',
    	'src/test/INT_TEST004.js',
    ]
  },

  rootElement : 'body',

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  }
}
