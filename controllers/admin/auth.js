const jwt = require('jsonwebtoken');
// const slack = require('../helpers/slackIntegration')();
const helpers = require('../../helpers/helpers');
const responses = require('../../helpers/responses');
const md5 = require('md5');
const _ = require('lodash');
const Joi = require('joi');
const config = require('../../config');
var objectId = require('mongodb').ObjectID;
const AdminModel = require('../../models/Admin');
const sendGrid = require('../../services/sendgrid');

exports.login = (req, res) => {
    try {
        let user_information = req.body;
        const schema = Joi.object().keys({
            email: Joi.string().email({
                minDomainAtoms: 2
            }).required(),
            password: Joi.string().required()
        });

        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            console.log('******* JOI Validatio Error at Login : ', result.error);
            responses.parameterMissing(res, result.error.details[0].message);
            return;
        }

        AdminModel
            .findOne({
                email: user_information.email
            })
            .then(async admin => {
                if (admin) {
                    if (admin.password === md5(admin.password)) {

                        if (admin.access_token)
                            admin.access_token = "";
                        admin.access_token = helpers.getJWTToken(JSON.parse(JSON.stringify(user)));
                        await admin.save();
                        delete admin.password;
                        responses.success(res, 'Success', admin);
                    } else {
                        responses.invalidCredential(res);
                    }
                } else {
                    responses.invalidCredential(res);
                    return;
                }
            })

            //User Find With Email catch
            .catch((e) => {
                console.log(e);
                responses.sendErrorMessage(res, e.message);
                return;
            });
    }
    //Parent Try Catch
    catch (error) {
        console.log(error);
        responses.sendErrorMessage(res, error.message);
        return;
    }
}



exports.forgetPassword = async (req, res) => {

    const schema = Joi.object().keys({
        email: Joi.string().required()
    });

    const result = Joi.validate(req.body, schema, {
        abortEarly: true
    });
    if (result.error) {
        console.log('******* JOI Validatio Error at Forget Password : ', result.error);
        responses.parameterMissing(res, result.error.details[0].message);
        return;
    }

    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            AdminModel.findOne({
                email: req.body.email
            }, function (err, admin) {
                if (!admin) {
                    return responses.sendErrorMessage(res, "Email not registered");
                }

                admin.set('resetPasswordToken', token);
                admin.set('resetPasswordExpires', Date.now() + 3600000); // 1 hour
                admin.save(function (err) {
                    done(err, token, admin);
                });
            })
        },
        function (token, admin, done) {

            let subject = 'KSIP Admin Reset Password';
            let text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                '<a href=' + config.passwordResetLink + 'admin/reset/' + token + '>' + config.passwordResetLink + 'user/reset/' + token + '</a>\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            EmailModules.promiseSendEmailViaTemplate(admin.email, subject, text)
                .then(info => {
                        responses.success(res, 'Password reset email has been sent to your email: ' + admin.email);
                    },
                    error => {
                        responses.sendErrorMessage(res, "Error Sending Email");
                    }
                );
            done(user);

        }
    ], function (err) {});
}


exports.passwordResetRequest = (req, res) => {
    AdminModel.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (!user) {
            return responses.sendErrorMessage(res, "Token has expired");
        }
        res.send(true);
    });
}