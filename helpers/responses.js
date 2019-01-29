let constants = require('./constant');

var response = {
    error: '',
    message: '',
    data: {}
};
var resetResVar = () => {
    response = {
        error: '',
        message: '',
        data: {}
    };
};

exports.parameterMissing = (res, result) => {
    resetResVar();
    response.error = result;
    res.status(constants.responseFlags.PARAMETER_MISSING).json(response);
};

exports.parameterMissingResponse = (res) => {
    resetResVar();
    response.error = constants.responseMessages.PARAMETER_MISSING;
    res.status(constants.responseconstants.responseMessages.PARAMETER_MISSING, Flags.PARAMETER_MISSING).json(response);
};

exports.sendInterOtpMsg = (res, result) => {
    resetResVar();
    response.message = "An OTP has been sent,please verify.";
    responses.data = result;
    response.flag = 1;

    res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
};

exports.sendError = (res) => {
    resetResVar();
    response.error = constants.responseMessages.ERROR_IN_EXECUTION;
    res.status(constants.responseFlags.ERROR_IN_EXECUTION).json(response);
};

exports.sendErrorMessage = (res, error) => {
    resetResVar();
    response.error = error;
    response.message = error;
    res.status(constants.responseFlags.ERROR_IN_EXECUTION).json(response);
};

exports.invalidNumber = (res) => {
    resetResVar();
    response.error = "You have entered a invalid Mobile Number.";
    res.status(constants.responseFlags.INVALID_CREDENTIAL).json(response);
};

exports.authenticationErrorResponse = (res) => {

    resetResVar();
    response.error = constants.responseMessages.INVALID_ACCESS_TOKEN;
    res.status(constants.responseFlags.INVALID_ACCESS_TOKEN).json(response);
};

exports.invalidCredential = (res) => {
    resetResVar();
    response.error = constants.responseMessages.INVALID_CREDENTIAL;
    res.status(constants.responseFlags.INVALID_CREDENTIAL).json(response);
};

exports.otpNotMatched = (res) => {
    resetResVar();
    response.error = "OTP not matched";
    res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
}

exports.success = (res, message, result) => {

    resetResVar();
    response.message = message ? message : constants.responseMessages.ACTION_COMPLETE;
    result ? response.data = result : response.data = {};
    res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
};

exports.alreaedyExists = (res, message, result) => {
    resetResVar();
    response.message = message ? message : constants.responseMessages.ACTION_COMPLETE;
    result ? response.data = result : response.data = {};
    res.status(constants.responseFlags.ALREADY_EXIST).json(response);
}