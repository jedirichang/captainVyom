const _ = require('lodash');
const UserModel = require('../../models/User');
const responses = require('../../helpers/responses');
const helpers = require('../../helpers/helpers');
const config = require('../../config');
var jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {
    console.log("===========================")
    console.log(req.body)
    let accessToken = _.pick(req.headers, 'access_token');

    if (_.isEmpty(accessToken)) {
        res.status(401).send({
            message: ' Unauthrized Access '
        });
        return;
    }

    UserModel.findOne(accessToken) // <= Fetch User by access token.
        .then(userData => {
            // ==== setting userdata in req.userDetail ======= else returning global error ==
            if (_.isEmpty(userData)) {
                responses.authenticationErrorResponse(res);
            } else {
                jwt.verify(accessToken.access_token, config.secret, function (err, decode) {
                    if (err) {
                        console.log(decode);
                        return res.status(401).send({
                            auth: false,
                            message: 'Failed to authenticate token.'
                        });
                        next(); // <= to call next in request cycle.
                    }
                    req.userDetail = helpers.toJson(userData);
                    next(); // <= to call next in request cycle.
                });


            }
        }).catch((e) => {
            responses.sendErrorMessage(e.message, res);
        });
};

module.exports = middleware;