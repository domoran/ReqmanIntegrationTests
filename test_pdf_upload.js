
var createServer = require("./lib/server.js");
var requests = require("./lib/requests.js");
var path = require('path');
var helpers = require('protractor-helpers');

var EC = protractor.ExpectedConditions;

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function expectNumber(nr) {
  var num = parseInt(nr + "");
  if (isNaN(num)) num = null;
  return num;
}

describe('Reqman Server Test', function() {
  var server = null;

  beforeEach(function () {
  	server = createServer().listen(6778);
  });

  afterEach(function () {
		if (server != null) server.close();
  });

  var projectID = null;
  var companyID = null;
  var documentID = null;

  it('should be able to login to reqman', function() {
    browser.get(requests.baseURL + "/login");
    $$('input[type=text]').sendKeys("admin");
    $$('input[type=password]').sendKeys("ReqMan_V2");
    $$('button').click();
    browser.wait(EC.presenceOf(element(by.linkText('Logout'))), 5000);
  });

  it('Should be possible to create a company', function (done) {
     browser.ignoreSynchronization = true;
     requests.post('/api/v1/Company', { name: guid() }, function (status, headers, data) {
        expect(status).toBeLessThan(300);
        companyID = expectNumber(data);
        done();
        browser.ignoreSynchronization = false;
    });
  });

  it('Should be possible to create a project', function (done) {
     browser.ignoreSynchronization = true;
     var data = { "customerId": companyID , "description": "Created by Interface Tests", "name": guid() };

     requests.post('/api/v1/Project', data, function (status, headers, data) {
        expect(status).toBeLessThan(300);
        projectID = expectNumber(data);
        // console.log("Company " + companyID + " Project " + projectID);
        done();
        browser.ignoreSynchronization = false;
    });
  });

  it('Should be possible to upload a document', function (done) {
    var data = {
      "url": "http://localhost:6778/data/little.pdf",
      "project": projectID,
      "previousId": 0,
      "createJob": false,
      "callbackUrl": "http://localhost:6778/callback",
    };


    requests.post('/api/v1/Document', data, function (status, headers, data) {
        expect(status).toBeLessThan(300);
        documentID = expectNumber(data);
        // console.log("Document " + documentID + " Project " + projectID);
        done();
        browser.ignoreSynchronization = false;
    });
  });

  it('Should be possible to upload a profile', function () {
      if (!projectID) { pending(); return; }

      browser.get(requests.baseURL + "/profiles/create/" + projectID);
      $$("input[name='name']").sendKeys("Litte Profile");
      absolutePath = path.join(__dirname, "data", "little.ric");
      $$("input[name='File']").sendKeys(absolutePath);
      $$('button[type=submit]').click();
      browser.wait(EC.presenceOf(element(by.xpath("//div[text()='Litte Profile']"))), 5000);
  });

  it('Should be possible to scan a the document with the profile', function (done) {
    if (!projectID || !documentID) { pending(); return; }

    // Scan document
    browser.get(requests.baseURL + "/scanner/selectprofile/" + documentID + ";type=documentversion");
    element(by.xpath("//div[text()='Litte Profile']/../div//a[@data-click='scann']")).click();

    // Visual checks in Reqman GUI
    var el1 = element(by.xpath("//*[contains(text(), 'Ich bin ein Heading')]"));

    // Wait for Reqman callback, to assure that document is finished
    server.onURI("/callback", function (headers, data) {
      expect(data.State).toBe("Finished");

      requests.get("/api/v1/Document/" + documentID, function (status, headers, data) {
        expect(status).toBeLessThan(300);
        expect(data.state).toBe("Finished");

        // goto forward page
        browser.get(data.link);

        // check for elements in document view
        browser.ignoreSynchronization = true;  // why is this necessary? Polling inside angular?
        expect(el1).toBePresent();
        browser.ignoreSynchronization = false;

        done();
      });

    });
  });
});
