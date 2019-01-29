let mongoose = require("mongoose");
let Media = require('../../models/Media');
const path = require('path');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../..');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

var userId = "";
var access_token = "";
var postId = "";

/*
 * Test the /GET Images.
 */
describe('/GET Images', () => {
    it('it should get images', (done) => {
        chai.request(server)
            .get('/data/media/images?page=0&&limit=10')
            .set("access_token", global.user_access_token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                done();
            });
    });
});



/*
 * Test the /GET Videos.
 */
describe('/GET Gifs', () => {
    it('it should get gifs', (done) => {
        chai.request(server)
            .get('/data/media/gifs?page=0&&limit=10')
            .set("access_token", global.user_access_token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                done();
            });
    });
});

/*
 * Test the /GET Videos.
 */
describe('/GET Videos', () => {
    it('it should get videos', (done) => {
        chai.request(server)
            .get('/data/media/videos?page=0&&limit=10')
            .set("access_token", global.user_access_token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                done();
            });
    });
});