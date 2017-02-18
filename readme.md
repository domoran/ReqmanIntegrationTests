# Reqman / RMDX Integration Tests

This repository contains the integration tests for two proprietary software products. It is used for exchanging test data. Therefore it is not of public interest, though it can be taken as an example for E2E (end to end) testing using [protractor](http://www.protractortest.org).


## Preparation


### Prerequisites

* [Node](https://nodejs.org) 6.9+
* [Git](https://git-scm.com/) (for checking out this repository)
* Make sure Protractor is installed by running:
```
    npm install -g protractor
    webdriver-manager update
```
* Launch a cmd.exe shell (make sure node 6.9 is in your path)


### Installing

1. checkout the git repository
```
  git clone https://github.com/domoran/ReqmanIntegrationTests.git
```
2. change to the directory
```
  cd ReqmanIntegrationTests
```
3. Install dependencies
```
  npm install
```
## Running the tests

1. Set the necessary evironment variables (Reqman API Key and server host/port)
```
  SET REQMANAPIKEY=eyJhb...cze8
  SET REQMANSERVER=localhost:90
```
2. Start the Protractor web driver manager
```
  start webdriver-manager start
```
3. start the tests
```
  protractor config.js
```

