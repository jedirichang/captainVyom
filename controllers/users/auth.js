const jwt = require('jsonwebtoken');
// const slack = require('../helpers/slackIntegration')();
const helpers = require('../../helpers/helpers');
const responses = require('../../helpers/responses');
const md5 = require('md5');
const _ = require('lodash');
const Joi = require('joi');
var objectId = require('mongodb').ObjectID;
const UserModel = require('../../models/User');
const sendGrid = require('../../services/sendgrid');


exports.sign_in_anonymity = async (req, res) => {
    try {
        let UserModel=req.models.User;
        let user_information = req.body;
        const schema = Joi.object().keys({
            unique_id: Joi.string().required()
        });

        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            console.log('******* JOI Validatio Error at Anonymous Entry : ', result.error);
            responses.parameterMissing(res, result.error.details[0].message);
            return;
        }

        var user = await UserModel.findOne({
            unique_id: user_information.unique_id
        });

        if (user) {
            if (user.access_token)
                user.access_token = '';
            user.access_token = helpers.getJWTToken(JSON.parse(JSON.stringify(user)));
            await user.save();
            responses.success(res, `Success`, user);
            return;
        }

        user_information.is_anonymous = true;
        user_information.username = helpers.generateRandomUsername();
        user_information.access_token = helpers.getJWTToken(JSON.parse(JSON.stringify(user_information)));
        user = await UserModel
            .create(user_information);

        responses.success(res, 'Successfully Created A new Anonymous User', user);

    } catch (e) {
        console.log(e);
        responses.sendErrorMessage(res, error.message);
        return;
    }
}

exports.createNewAnonymousUser =async (req, res) => {
    try {
        let user_information = req.body;
        const schema = Joi.object().keys({
            unique_id: Joi.string().required()
        });

        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            console.log('******* JOI Validatio Error at Anonymous Entry : ', result.error);
            responses.parameterMissing(res, result.error.details[0].message);
            return;
        }

        await UserModel.remove({
            unique_id: user_information.unique_id
        });

        user_information.is_anonymous = true;
        user_information.username = helpers.generateRandomUsername();
        user_information.access_token = helpers.getJWTToken(JSON.parse(JSON.stringify(user_information)));
        user = await UserModel
            .create(user_information);

        responses.success(res, 'Successfully Created A new Anonymous User', user);

    } catch (e) {
        console.log(e);
        responses.sendErrorMessage(res, error.message);
        return;
    }
}

exports.signup = async (req, res) => {
    try {
        let user_information = req.body;
        const schema = Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(40).required(),
            password: Joi.string().required(),
            unique_id: Joi.string().required()
        })

        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            console.log('******* JOI Validatio Error at user/signup_email : ', result.error);
            responses.parameterMissing(res, result.error.details[0].message);
            return;
        }

        user_information.createdAt = new Date();
        user_information.createdAtIso = user_information.createdAt.toISOString();
        // user_information.verification_code = JSON.stringify(helpers.generateOTP());

        //  let user = new UserModel(user_details);

        UserModel
            .findOne({
                username: user_information.username
            })
            .then(alreadyExistingUser => {
                if (alreadyExistingUser) {
                    responses.alreaedyExists(res, 'Username Already Exists');
                } else {
                    user_information.password = md5(user_information.password);
                    UserModel
                        .findOne({
                            unique_id: user_information.unique_id
                        })
                        .then(async (userData) => {
                            if (userData) {
                                userData.unique_id = undefined;
                                userData.username = user_information.username;
                                userData.password = user_information.password;
                                userData.createdAt = user_information.createdAt;
                                userData.createdAtIso = user_information.createdAtIso;
                                userData.is_anonymous = false;
                                await userData.save();
                                userData.password="";
                                responses.success(res, `User Createdf Successfully`, userData);
                            } else {
                                responses.sendErrorMessage(res, `User with this device id dosen't exists`);
                            }
                        })
                        //User Model Create Catch
                        .catch((e) => {
                            responses.sendErrorMessage(res, e.message);
                            return;
                        });
                }
            })

            //User Find With Email catch
            .catch((e) => {
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


exports.login = (req, res) => {
    try {
        let user_information = req.body;
        const schema = Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(40).required(),
            password: Joi.string().required()
        })

        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            console.log('******* JOI Validatio Error at Login : ', result.error);
            responses.parameterMissing(res, result.error.details[0].message);
            return;
        }


        // user_information.verification_code = JSON.stringify(helpers.generateOTP());

        //  let user = new UserModel(user_details);

        UserModel
            .findOne({
                username: user_information.username
            })
            .then(async user => {
                if (user) {
                    if (user.password === md5(user_information.password)) {

                        if (user.access_token)
                            user.access_token = "";
                        user.access_token = helpers.getJWTToken(JSON.parse(JSON.stringify(user)));
                        await user.save();
                        delete user.password;
                        responses.success(res, 'Success', user);
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


exports.usernameExists = async (req, res) => {
    try {
        let username = req.body.username;
        let fetchedUsername = await UserModel.findOne({
            username: username
        });

        if (fetchedUsername) {
            responses.alreaedyExists(res, 'Username Already Exists');
        } else {
            responses.success(res, 'Username Valid', {});
        }
    } catch (error) {
        responses.sendErrorMessage(res, error.message);
    }
}

exports.emailVerification = async (req, res) => {

    const schema = Joi.object().keys({
        email: Joi.string().required(),
        user_id: Joi.string().required()
    });

    const result = Joi.validate(req.body, schema, {
        abortEarly: true
    });
    if (result.error) {
        console.log('******* JOI Validatio Error at Email Verification : ', result.error);
        responses.parameterMissing(res, result.error.details[0].message);
        return;
    }

    var email = req.body.email;
    var user_id = req.body.user_id;

    let userWithEmail = await UserModel.findOne({
        email: email
    });
    if (userWithEmail) {
        responses.alreaedyExists(res, 'Email Already Exists');
    } else {
        let subject = 'KSIP Email Verification';
        let text = '************Disclaimer*********** \n' +
            'This is a demo email verification File. \n' +
            'Your mission, should you choose?. \n' +
            'This email will self destruct in T-3 seconds \n' +
            '<a href="www.google.com"> Click Here </a> \n'
        sendGrid.promiseSendEmailViaTemplate(email, subject, text)
            .then(async info => {

                },
                error => {
                    responses.sendErrorMessage(res, "Error Sending Email");
                });

        await UserModel.findByIdAndUpdate(user_id, {
            $set: {
                email: email
            }
        });

        responses.success(res, 'Verification Email Sent', email);
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


    let email = req.body.email;
    let user = await UserModel.findOne({
        email: email
    });
    if (user) {
        let subject = 'KSIP Password Reset';
        let text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            '<a href="www.google.com">Click Here</a>' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        sendGrid.promiseSendEmailViaTemplate(user.email, subject, text)
            .then(info => {

                },
                error => {
                    responses.sendErrorMessage(res, "Error Sending Email");
                }
            );
        responses.success(res, 'Password reset email has been sent to your email: ' + email);
    } else {
        responses.sendErrorMessage(res, "Email Doesn't Exists");
    }
}