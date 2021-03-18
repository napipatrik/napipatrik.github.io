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
