const nodeMailerModule = require('nodemailer');
const config = require('../config.json');
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = nodeMailerModule;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SendGrid.SENDGRID_API_KEY);

exports.sendEmailViaSendgrid = (to, subject, html) => {
    // const msg = {
    //     to,
    //     from: config.emailCredentials.From,
    //     subject,
    //     // text: 'and easy to do anywhere, even with Node.js',
    //     html
    // };

    // return sgMail.send(msg);

    exports.sendEmailViaTemplate(to, subject, html)
}

const SendGrid = {
    "host": config.SendGrid.SendGrid_host,
    "auth": {
        "user": config.SendGrid.SendGrid_auth.SendGrid_user,
        "pass": config.SendGrid.SendGrid_auth.SendGrid_pass
    }
}
const transporter = nodeMailerModule.createTransport(smtpTransport(SendGrid));

exports.sendEmailViaTemplate = (to, subject, html) => {
    var mailOptions = {
        from: config.emailCredentials.From,
        to: to,
        subject: subject,
        html: html
    };
    transporter.sendMail(mailOptions, function (error, info) {
        console.log('Mail Sent Callback Error:', error);
        console.log('Mail Sent Callback Ifo:', info);
    });

    // exports.sendEmailViaAWS(to, subject, html);
}

exports.promiseSendEmailViaTemplate = (to, subject, html) => {
    return new Promise((res, rej) => {
        var mailOptions = {
            from: config.emailCredentials.From,
            to: to,
            subject: subject,
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            // if (error)
            //     rej(error);
            // else
            //     res(info);
            res();
            console.log('Mail Sent Callback Error:', error);
            console.log('Mail Sent Callback Ifo:', info);
        });
    });
    // exports.sendEmailViaAWS(to, subject, html);
}

/**
 * Send Email using AWS Credentials.
 *  
 * @param {*} to 
 * @param {*} subject 
 * @param {*} html 
 */
exports.sendEmailViaAWS = (to, subject, html) => {

    // let transporter = nodemailer.createTransport(config.AWSEmail);

    // var mailOptions = {
    //     from: config.emailCredentials.From,
    //     to: to,
    //     subject: subject,
    //     html: html
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //     console.log('Mail Sent Callback Error:', error);
    //     console.log('Mail Sent Callback Ifo:', info);
    // });

    exports.sendEmailViaTemplate(to, subject, html)
}
