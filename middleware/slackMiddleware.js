const slack = require('../helpers/slackIntegration')();

const middleware = (req, res, next) => {
    slack.notify({
        message: `Route: ${req.path}\n Request:${JSON.stringify(req.body, null, "\t")}`
    }, 'info');
    next();
};

module.exports = middleware;