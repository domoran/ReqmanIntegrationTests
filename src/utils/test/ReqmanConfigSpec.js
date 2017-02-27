var reqmanConfig = require('../ReqmanConfig');

describe('Reqman Configuration', function () {
    it("Should determine the Reqman URL", function () {
      var config = reqmanConfig ({ REQMANURL: "x", REQMANTOKEN: "y"});
      expect(config.token).toBe("y");
      expect(config.baseURL).toBe("x");
    });

    it('Should throw an error in REQMANURL environment is not set', function () {
        expect(function () {
          reqmanConfig ({});
        }).toThrow("Missing REQMANURL configuration!");
    });
});
