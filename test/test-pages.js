// const app = require('../server.js');

 var expect  = require('chai').expect;
 var request = require('request');
 var server = require('../server.js');
	

//Basic test to ensure it is set up correctly
describe('Basic test', function () {
    it('Ensuring the testing is working', function () {
        expect(true).to.be.true;
    });
});
//Ensuring that the application can load the application
describe('Test main page', function () {
    it('Get Main Page', function(done) {
    request('http://localhost:4200/#!/', function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();

    })
})
})


