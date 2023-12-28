'use strict';

const https = require('https');

const sitename = 'napipatrik';
const domain = sitename + '.hu';

exports.fetchContent = function (path) {
  return new Promise((resolve, reject) => {
    const request = https.request('https://' + domain + '/' + path, res => {
      var response = "";

      res.on('data', d => {
        response += d;
      });

      res.on('end', () => {
        resolve(response);
      });
    });

    request.on('error', e => {
      reject(e);
    });
    request.end();
  });
}

exports.unaccent = function (str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

exports.sitename = sitename;
