const Joi = require('joi');
const responses = require('./responses');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const fs = require('fs');
const path = require('path');
// const { DebuggerModel } = require('../models/Debugger');

// ================= to convert the mongoose db obj to json ===============
exports.toJson = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000)
}


/**
 * @param {JSON} obj {} JSON to validate, It aborts early.
 * @param {JoiSchema} schema Join schema to validate
 * @param {Response} res Express Response Object 
 * @return {JoiResult} result when validates successfully.
 * @return {boolean} false when validation fails. and sends the response to client as well.
 */
exports.validateRequest = (obj, schema, res) => {

    try {

        const result = Joi.validate(obj, schema, {
            abortEarly: true
        });

        if (result.error) {
            if (result.error.details && result.error.details[0].message) {
                responses.parameterMissing(res, result.error.details[0].message);
                return false;
            } else {
                responses.parameterMissing(res, result.error.message);
                return false;
            }
        }
        return result;
    } catch (error) {
        console.log(' error => ', error);
    }
}

/**
 * Generate the JWt token.
 * 
 * @param {{}} payload Object to sign in
 * @returns JWT Token. 
 */
exports.getJWTToken = (payload) => {
    return jwt.sign(payload, config.secret);
}

/**
 * verify the token and returns the payload
 * 
 * @param {Token} token JWT Token.
 * @returns {{}} payload.
 */
exports.verifyJWTToken = (token) => {
    return jwt.verify(token, config.secret);
}


/**
 * Log the exceptions in DB to debug errors later.
 * 
 * @param {new Error} e Exception Error 
 * @param {String} msg Any Custom message 
 * 
 * @todo Fix the logger.
 */
exports.logException = (e, msg = '') => {

    let error = {
        custom_msg: msg,
        message: e.message,
        exception: e,
        time: new Date()
    }

    let logger = new DebuggerModel(error);
    logger
        .save()
        .then(logger => {})
        .catch(e => {})
}


/**
 * Log the exceptions in DB to debug errors later.
 * 
 * @param {new Error} e Exception Error 
 * @param {String} msg Any Custom message 
 * 
 * @todo Fix the logger.
 */

exports.removeFiles = req => {
    return new Promise((res, rej) => {
        fs.unlink(path.join(__dirname, '..', 'uploads', 'responsive', req), (er) => {
            if (er) {
                rej();
            } else {
                res();
            }
        })
    })

}



//Generate 8 Character Word
exports.generateRandomUsername=req=>{
  return "anonymous_" + Math.random().toString(36).substring(7);
}