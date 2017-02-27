// conf.js
exports.config = {
  framework: 'jasmine',

  seleniumAddress: 'http://localhost:4445/wd/hub',

  suites: {
    configure: 'src/test/test_configure.js',

    api: 'src/test/test_api.js',

    integration: [
      'src/test/test_pdf_upload.js',
    ]
  },

  rootElement : 'body',

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  }
}
