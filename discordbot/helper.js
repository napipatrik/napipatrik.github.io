'use strict';

const https = require('https');

const sitename = 'napipatrik';
const domain = sitename + '.hu';

exports.fetchContent = function (path, callback) {
  const request = https.request('https://' + domain + '/' + path, res => {
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

exports.unaccent = function (str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

exports.sitename = sitename;
