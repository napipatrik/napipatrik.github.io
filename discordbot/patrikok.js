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
