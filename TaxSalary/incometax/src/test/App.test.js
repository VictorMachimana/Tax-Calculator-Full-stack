let expect = require("chai").expect;
let request = require("request");

describe("Status and content", function() {
  describe("Salaries page", function() {
    it("status", function(done) {
      request("http://localhost:3000/salaries", function(
        error,
        response,
        body
      ) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it("content", function(done) {
      request("http://localhost:3000/salaries", function(
        error,
        response,
        body
      ) {
        expect(body).to.equal("respond with a resource");
        done();
      });
    });
  });
});
