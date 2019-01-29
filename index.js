const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
config = require('./config.json');
// const slack = require('./lib/helpers/slackIntegration')();
// const adminRoutes = require('./lib/routes/adminRoutes')
// const dashboardRoutes = require('./lib/routes/dashboardRoutes');
// const slackmiddleware = require('./lib/middlewares/slackmiddleware');
var indexRouter = require('./routes/index');
const attachModelsMiddleware = require('./middleware/attachModelsToRequest');
// const errorToSlack = require('express-error-slack');

const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];
app.use(cors());

app.use(bodyparser.urlencoded({
    limit: '50mb'
}));

app.use(bodyparser.json());

// app.use('/', slackmiddleware, indexRouter);
app.use('/', attachModelsMiddleware, indexRouter);

// app.use(errorToSlack({
//     webhookUri: config.slack.webhook
// }));


// Connect to Mongoose instance
if(process.env.NODE_ENV !== 'test'){
mongoose.connect(config.db);
console.log('Running in Development Mode....');
}
else{
mongoose.connect(config.test_db);
console.log('Running in Testing Mode....');
}

let port = process.env.PORT || 3000;


app.listen(port, function (req, res) {
    // slack.notify({
    //     message: `Server Ruuning on port ${port}`
    // }, 'info');
    console.log("app is listen on the port no ", port);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'coverage')));

app.get('**', (req, res) => {
    console.log(req.url);
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        console.log('allowext');
        let url = req.url.split('?')[0];
        res.sendFile(path.resolve(path.join(__dirname, 'dist', url)));
    } else {
        console.log('else');
        res.sendFile(path.resolve(path.join(__dirname, 'dist', 'index.html')));
    }
});

process.on('unhandledRejection', (reason, p) => {
    let message = `Unhandled Rejection at: Promise:${p} \n reason:${reason}`;
    console.log(message);
    // slack.notify({
    //     message: message
    // }, 'error');
    // application specific logging, throwing an error, or other logic here
});

module.exports = app;