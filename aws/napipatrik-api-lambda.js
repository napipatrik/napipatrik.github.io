const url = require('url');
const qs = require('querystring');

exports.handler = (event, context, callback) => {
    let id = qs.parse(event.body)['text'];

    let url;
    if (id) {
        console.log("ID: ", id);

        url = "https://napipatrik.hu/assets/js/patrikok.js";
    } else {
        url = "https://napipatrik.hu/napipatrik";
    }

    
    require('https').get(url, function(resp) {
        let data = '';
        let body = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            if (id) {
                eval(data);
                id = Number(id) == NaN ? 0 : Number(id);
                body = patrikok[id] === undefined ? patrikok[0] : patrikok[id];
            } else {
                body = data.trim();
            }

            callback(null, {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                body: body
            });
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        callback(null, {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(e)
        });
    });
};

