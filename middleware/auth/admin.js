const _ = require('lodash');
const AdminModel = require('../../models/Admin');
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

    AdminModel.findOne(accessToken) // <= Fetch User by access token.
        .then(adminData => {
            // ==== setting userdata in req.userDetail ======= else returning global error ==
            if (_.isEmpty(adminData)) {
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
                    if (!adminData.isAdmin) {
                           return res.status(401).send({
                               auth: false,
                               message: 'Aww, get away, you are not an admin'
                            });
                            next();
                    }
                    req.adminDetails = helpers.toJson(adminData);
                    next(); // <= to call next in request cycle.
                });


            }
        }).catch((e) => {
            responses.sendErrorMessage(e.message, res);
        });
};

module.exports = middleware;