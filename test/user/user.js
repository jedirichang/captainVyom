let mongoose = require("mongoose");
let User = require('../../models/User');
let Post = require('../../models/Post');
let Hashtag = require('../../models/Hashtag');
const Like = require('../../models/Like');
const comment = require('../../models/Comment');
const path = require('path');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../..');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);


/*
 * Test the /POST Login User.
 */
describe('/POST Username Exists', () => {
    it('it should return if Username Exists', (done) => {
        let data = {
            username: "richangsharma",
        }
        chai.request(server)
            .post('/user/auth/username/exists')
            .send(data)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.message.should.be.eql("Username Already Exists");
                done();
            });
    });
});

/*
 * Test the /POST Validate Email.
 */
describe('/POST Validate Email', () => {
    it('it should validate email', (done) => {
        let data = {
            email: "example@gmail.com",
            user_id: global.userId

        }
        chai.request(server)
            .post('/user/auth/email/verification')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.eql("example@gmail.com");
                done();
            });
    });
});

/*
 * Test the /POST Forget Password.
 */
describe('/POST Forget Password', () => {
    it('it should send forget password email', (done) => {
        let data = {
            email: "example@gmail.com"

        }
        chai.request(server)
            .post('/user/auth/forget/password')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});


/*
 * Test the /GET Get Question.
 */
describe('/GET Get Question', () => {
    it('it should get a random question', (done) => {
        chai.request(server)
            .get('/user/getquestion')
            .set("access_token", global.user_access_token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                done();
            });
    });
});


/*

 * Test the /GET Get Popular Hashtags.
 */
describe('/GET Get Popular Hastags', () => {
    it('it should get popular Hastags', (done) => {
        chai.request(server)
            .get('/user/popularHashtag')
            .set("access_token", global.user_access_token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                done();
            });
    });
});


/*

 * Test the /POST Create Anonymous.
 */
describe('/POST Create a new anonymous user', () => {
    it('it should create a new anonymous user', (done) => {
        let data = {
            unique_id: "testing_unique_id"
        }
        chai.request(server)
            .post('/user/auth/create/anonymous')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                done();
            });
    });
});


/*

 * Test the /POST Create Post.
 */
describe('/POST Create a new post', () => {
    it('it should create a new post', (done) => {
        let data = {
            text: "Testing Post",
            text_color: "red",
            bg_color: "red",
            font_size: "3",
            font_family: "asda",
            text_style: 'italic',
            emoji_code: '#1234',
            co_ordinates: "12",
            hashtag_name: 'new3,new7'
        }
        chai.request(server)
            .post('/user/createpost')
            .set('access_token', global.user_access_token)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .field('Content-Type', 'multipart/form-data')
            .attach('image', path.join(__dirname, '..', 'media', 'test_image.jpg'))
            .attach('video', path.join(__dirname, '..', 'media', 'test_video.mp4'))
            .send(data)
            .end((err, res) => {
                global.postId = res.body.data._id;
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                done();
            });
    });
});


/*

 * Test the /POST Search Hashtags.
 */
describe('/POST Search hashtag', () => {
    it('it should produce serached hashtag.', (done) => {
        let data = {
            query: "new"
        }
        chai.request(server)
            .post('/user/searchHashtags')
            .set('access_token', global.user_access_token)
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                done();
            });
    });
});

/*

 * Test the /POST Like Post.
 */
describe('/POST Like Post', () => {
    it('it should like a post.', (done) => {
        let data = {
            query: "new"
        }
        chai.request(server)
            .post('/user/like/post/' + global.postId)
            .set('access_token', global.user_access_token)
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.be.eql('Success');
                done();
            });
    });
});


/*
 * Test the /POST Comment On Post.
 */
describe('/POST Comment Post', () => {
    it('it should comment on a post.', (done) => {
        let data = {
            text: "This is a test comment"
        }
        chai.request(server)
            .post('/user/comment/post/' + global.postId)
            .set('access_token', global.user_access_token)
            .send(data)
            .end(async (err, res) => {
                res.should.have.status(200);
                res.body.message.should.be.eql('Comment successfully posted');
                await clearUserDb();
                done();
            });
    });
});

async function clearUserDb() {
    await User.remove({});
    await Post.remove();
    await Hashtag.remove();
    await Like.remove();
    await comment.remove();
}