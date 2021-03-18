'use strict';

const helper = require('./helper');

let patrikok = [];

function reloadTutilista() {
  helper.fetchContent('assets/js/patrikok.js', (tutilista, error) => {
    if (error) {
      console.log('Tutilista betöltése sikertelen!');
      process.exit(1);
    }

    eval(tutilista);
    patrikok = module.exports;
  });
}

reloadTutilista();
setInterval(() => reloadTutilista(), 3600 * 1000);

exports.get = function (id) {
  return patrikok[id];
}

exports.count = function () {
  return patrikok.length;
}

exports.find = function (keywords) {
  if (!keywords.length) {
    return '';
  }

  keywords = keywords.map(keyword => keyword.toLowerCase());

  try {
    let filteredList = patrikok;
    for (const keyword of keywords) {
      filteredList = filteredList.filter(tuti => tuti.toLowerCase().includes(keyword));
    }

    if (filteredList.length) {
      return filteredList[0];
    }
  } catch (e) {
  }

  return '';
}
