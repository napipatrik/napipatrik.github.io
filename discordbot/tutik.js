'use strict';

const helper = require('./helper');

let tutik = [];

function reloadTutilista() {
  helper.fetchContent('assets/js/patrikok.js')
    .then(tutilista => {
      eval(tutilista);
      tutik = module.exports;
    })
    .catch(error => {
      console.log('Tutilista betöltése sikertelen!');
      process.exit(1);
    });
}

reloadTutilista();
setInterval(() => reloadTutilista(), 3600 * 1000);

exports.get = function (id) {
  return tutik[id];
}

exports.count = function () {
  return tutik.length;
}

exports.find = function (keywords) {
  if (!keywords.length) {
    return '';
  }

  try {
    let filteredList = tutik;
    for (const keyword of keywords) {
      filteredList = filteredList.filter(tuti => helper.unaccent(tuti.toLowerCase()).includes(keyword));
    }

    if (filteredList.length) {
      return shuffle(filteredList)[0];
    }
  } catch (e) {
  }

  return '';
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
