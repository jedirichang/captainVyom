let mongoose = require("mongoose");
let User = require('../models/User');
let Post = require('../models/Post');
let Hashtag = require('../models/Hashtag');
const Like = require('../models/Like');
const comment = require('../models/Comment');
const path = require('path');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('..');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);


/*
 * Test the /POST Register New Anonymous.
 */
describe('/POST Anonymous', () => {
    it('it should register anonymous user', (done) => {
        User.remove({}, err => {
            Post.remove({}, err => {
                Hashtag.remove({}, err => {
                    let data = {
                        unique_id: "something shit"
                    }
                    chai.request(server)
                        .post('/user/auth/signup/anonymous')
                        .send(data)
                        .end((err, res) => {
                            global.userId = res.body.data._id;

                            res.should.have.status(200);
                            res.body.data.should.be.a('object');
                            res.body.data.should.have.property('unique_id');
                            res.body.data.should.have.property('is_anonymous');
                            res.body.data.should.have.property('username');
                            res.body.data.should.have.property('access_token');
                            done();
                        });
                });
            });

        });

    });
});


/*
 * Test the /POST Create account for existing anonymous user.
 */
describe('/POST Create User Account', () => {
    it('it should create user account', (done) => {
        let data = {
            unique_id: "something shit",
            username: "richangsharma",
            password: "1234567"
        }
        chai.request(server)
            .post('/user/auth/signup')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('is_anonymous');
                res.body.data.should.have.property('username');
                res.body.data.should.have.property('access_token');
                res.body.data.should.have.property('password');

                done();
            });
    });
});

/*
 * Test the /POST Login User.
 */
describe('/POST Login User', () => {
    it('it should login in user account', (done) => {
        let data = {
            username: "richangsharma",
            password: "1234567"
        }
        chai.request(server)
            .post('/user/auth/login')
            .send(data)
            .end((err, res) => {
                global.user_access_token = res.body.data.access_token;
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('is_anonymous');
                res.body.data.should.have.property('username');
                res.body.data.should.have.property('access_token');
                res.body.data.should.have.property('password');
                expect(res.body.data.is_anonymous).to.be.false;
                done();
            });
    });
});