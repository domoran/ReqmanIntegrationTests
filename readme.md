# Reqman / RMDX Integration Tests

This repository contains the integration tests for two proprietary software products. It is used for exchanging test data. Therefore it is not of public interest, though it can be taken as an example for E2E (end to end) testing using [protractor](http://www.protractortest.org).


## Preparation


### Prerequisites

* Install [Node 6.9](https://nodejs.org)
* Install [Git](https://git-scm.com/) (for checking out this repository)
* Install [Selenium Server](http://docs.seleniumhq.org/download) (see below)

### Installing and Starting Selenium Server

* Make sure that you have a [Java Runtime Environment](https://www.java.com/de/download/) on your machine and that "java.exe" is on your path.
* Download the [Selenium Server Standalone](http://selenium-release.storage.googleapis.com/3.1/selenium-server-standalone-3.1.0.jar)
* Download the [Selenium Chrome Driver](https://chromedriver.storage.googleapis.com/2.27/chromedriver_win32.zip)
* Put both files inside a directory (extract the chromedriver)
* In the directory of the Selenium Server create a "start.bat" file:

```
start java -jar selenium-server-standalone-3.1.0.jar -role hub -port 4445
timeout /T 3
start java -Dwebdriver.chrome.driver=%CD%\chromedriver.exe -jar selenium-server-standalone-3.1.0.jar -role node -host localhost -hubHost localhost -hubPort 4445
```
* Run the start.bat file (two java processes should come up after some time)

### Installing the Test Framework

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

1. Set the necessary evironment variables (first start only)
```
  SET REQMANSERVER=http://localhost:90
```
```
  SET REQMANADMINUSER=???
```
```
  SET REQMANADMINPASS=???
```
2. make sure that the API tokens are correctly configured (only once)
```
  npm run config
```
This will create an API Token on your Reqman installation and store it to a *reqman_config.json* file.
3. Run the tests
```
  npm run tests
```

## Contributing

After adding code, make sure to run the linter to ensure consistent formatting of your code:
```
  npm run lint
```


