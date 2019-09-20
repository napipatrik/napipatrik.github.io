const qs = require('querystring');
const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    var req = event.queryStringParameters;

    if (!req.code) {
        console.log("Access denied!");
        callback(null, {
            "statusCode": 403,
            "headers": {
                "Content-Type": "application/json"
            },
            body: "Access denied"
        });
        return;
    }

    var data = qs.stringify({
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: req.code
    });

    var options = {
        hostname: 'slack.com',
        port: 443,
        path: '/api/oauth.access',
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": data.length
        }
    }

    const request = require('https').request(options, res => {
        var responseData = "";

        res.on('data', d => {
            responseData += d;
        });

        res.on('end', () => {
            let tokens = JSON.parse(responseData);

            let docClient = new AWS.DynamoDB.DocumentClient();
            let params = {
                TableName: 'napipatrik-slack-oauth',
                Item: {
                    "team_id": tokens.team_id,
                    "access_token": tokens.access_token,
                    "created": new Date().toUTCString()
                }
            };

            docClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    callback(null, {
                        "statusCode": 500,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        body: "Error while writing to DB!"
                    });
                } else {
                    console.log("Team is added: " + tokens.team_id);
                    callback(null, {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        body: "Successfully subscribed!"
                    });
                }
            });
        });
    })

    request.on('error', error => {
        console.error(error);
    })

    request.write(data);
    request.end();
}
