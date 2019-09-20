const qs = require('querystring');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    var id = qs.parse(event.body)['text'];

    if (id.trim() === "help") {
        callback(null, {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "response_type": "ephemeral",
                "text": "Használat: `/napipatrik [id]`\nahol az opcionális id az idézet száma (permalink id)"
            })
        });
        return;
    }

    let file;
    if (id) {
        console.log("ID: ", id);

        file = "assets/js/patrikok.js";
    } else {
        file = "napipatrik";
    }

    var params = { Bucket: 'napipatrik', Key: file };
    s3.getObject(params, function(err, data) {
        if (err) {
            console.log("Got error: ");
            console.log(err);
            callback(null, {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(err)
            });
            return;
        }

        let body = '';
        if (id) {
            eval(data.Body.toString());
            id = Number(id) == NaN ? 0 : Number(id);
            body = patrikok[id] === undefined ? patrikok[0] : patrikok[id];
        } else {
            body = data.Body.toString().trim();
        }

        callback(null, {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "response_type": "in_channel",
                "text": body
            })
        });
    });
};

