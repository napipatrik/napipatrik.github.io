'use strict';

const sitename = 'napipatrik';
const domain = sitename + '.hu';


exports.fetchContent = async function (path) {
  const response = await fetch('https://' + domain + '/' + path);
  return response.text();
}

exports.unaccent = function (str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

exports.sitename = sitename;
