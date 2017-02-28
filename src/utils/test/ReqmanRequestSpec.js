var Request = require("../ReqmanRequest"),
    nock = require("nock"),
    stream = require("stream");

var config = {
    baseURL : "http://localhost:90",
    apiURL : "http://localhost:90/api/v1",
    token : "abc",
};

describe("ReqmanAPI", function () {
    it("shall issue a get request correctly and return json data", function (done) {
        var request = Request(config);

        nock("http://localhost:90")
        .get("/api/v1/test")
        .matchHeader("authorization", "Bearer abc")
        .reply(200, "{\"test\":\"value\"}", { "content-type" : "application/json" });

        request.get("/test", function (status, headers, data) {
            expect(headers).toEqual({ "content-type" : "application/json" });
            expect(data).toEqual({test: "value"});
            done();
        });
    });

    it("shall issue a post request correctly and return json data", function (done) {
        var request = Request(config);

        nock("http://localhost:90")
        .post("/api/v1/posttest", {}, "response-request")
        .matchHeader("authorization", "Bearer abc")
        .reply(200, "{\"test\":\"value\"}", { "content-type" : "application/json" });

        request.post("/posttest", "response-request", function (status, headers, data) {
            expect(headers).toEqual({ "content-type" : "application/json" });
            expect(data).toEqual({test: "value"});
            done();
        });
    });

    it("shall issue get and post requests and not convert non-json data", function (done) {
        var request = Request(config);

        nock("http://localhost:90")
        .post("/api/v1/posttest", {}, "response-request")
        .matchHeader("authorization", "Bearer abc")
        .reply(200, "112x", { "content-type" : "text/plain" });

        request.post("/posttest", "response-request", function (status, headers, data) {
            expect(data).toEqual("112x");
            done();
        });
    });

    it("shall be able to download a file", function (done) {
        var request = Request(config);
        nock("http://localhost:90")
        .get("/api/v1/filetest")
        .reply(200, function() {
            var strm = new stream.PassThrough();
            setTimeout(function () {
                strm.write("Chunk 1");
                setTimeout(function () { strm.write("Chunk 2"); }, 30);
            }, 30);

            return strm;
        });

        request.download("/filetest", function (error, strm) {
            var cnt = 0;
            var data = "";
            strm.on("data", function(chunk) {
                if (chunk) data += chunk;
                cnt++;
                if (cnt == 2) {
                    expect(data).toEqual("Chunk 1Chunk 2");
                    done();
                }
            });
        });
    });

});
