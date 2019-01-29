var request = require('request');
config = require('../config.json');

module.exports = () => {
    function makeReqObj(message, type) {
        var reqObj;

        switch (type) {
            case 'info':
                reqObj = {
                    json: {
                        "channel": config.slack.channel,
                        "username": "server",
                        "text": message.message,
                        "attachments": [{
                            "fallback": "Journalong-Server",
                            "pretext": "Journlaong-Server",
                            "color": "#00D000",
                            "fields": [{
                                "title": "Message",
                                "text": message.message,
                                "short": false
                            }]
                        }],
                        "icon_emoji": ":trollface:"
                    },
                    url: config.slack.webhook,
                    method: 'POST'
                };
                break;
            case 'error':
                var val =
                    reqObj = {
                        json: {
                            "channel": config.slack.channel,
                            "username": "server-error",
                            "text": "Error: " + message.message,
                            "attachments": [{
                                    "fallback": "Journalong-Server",
                                    "pretext": "Meta",
                                    "color": "#ff0000",
                                    "fields": [{
                                        "title": "Meta Info",
                                        "value": message.meta ? message.meta : 'No meta found',
                                        "short": false
                                    }]
                                },
                                {
                                    "fallback": "Multi-Location-masterServer-error",
                                    "pretext": "Multi-Location-masterServer-error",
                                    "color": "#D00000",
                                    "fields": [{
                                        "title": "Stack Trace",
                                        "value": message.stack ? message.stack : 'No stack trace found',
                                        "short": false
                                    }]
                                }
                            ],
                            "icon_emoji": ":trollface:"
                        },
                        url: config.slack.webhook,
                        method: 'POST'
                    };
                break;
            default:
                break;
        }
        return reqObj;
    }

    function notify(message, type) {
        try {
            // var blackList = ['Error: getaddrinfo ENOTFOUND hooks.slack.com hooks.slack.com:443'];
            // if (global.env == 'LOCAL')
            //     return;

            // if (!type)
            //     type = 'error';

            // Check the message against blacklist and exit
            // if we are not supposed to notify the message

            // if (blackList.contains(message.message))
            //     return;

            var obj = makeReqObj(message, type);
            request.post(obj, function (err, resp) {
                //console.log(resp);
                if (err)
                    global.logger.logError(err);
                else
                    console.log('Slack notified');

                return (true);
            });
        } catch (e) {
            console.log("******** Error sending slack notifications *********");
        }
    }

    return {
        notify: notify
    }
}