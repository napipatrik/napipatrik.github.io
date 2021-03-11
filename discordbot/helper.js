'use strict';

const https = require('https');

exports.fetchContent = function (path, callback) {
  const request = https.request('https://napipatrik.hu/' + path, res => {
    var response = "";

    res.on('data', d => {
      response += d;
    });

    res.on('end', () => {
      callback(response);
    });

  });

  request.on('error', e => {
    callback('', e);
  });
  request.end();
}
