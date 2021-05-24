const helper = require('./helper');
const tutik = require('./tutik');

exports.getTuti = async function (what, ...parts) {
  switch (what) {
    case 'napi':
    case 'mai':
    case 'daily':
      return maiTuti();
    case 'kep':
    case 'napikep':
    case 'pic':
    case 'picture':
      return maiKep();
    case 'random':
    case 'veletlen':
      return random();
    case 'keres':
    case 'keress':
    case 'kereso':
    case 'find':
      return search(parts);
    case 'id':
      return byId(parts[0]);
    default:
      return Promise.reject();
  }
}


const maiTuti = function () {
  console.log('Napituti lekérdezés');
  return helper.fetchContent('napipatrik');
}

const maiKep = function () {
  console.log('Napikép lekérdezés');
  return new Promise((resolve, reject) => {
    resolve({
      files: [{
        attachment: 'https://napipatrik.hu/napipatrik.jpg',
        name: 'napipatrik.jpg'
      }]
    });
  });
}

const random = function () {
  console.log('Random tuti lekérdezés');
  return new Promise((resolve, reject) => {
    resolve(tutik.get(Math.floor(Math.random() * tutik.count())));
  });
}

const search = function (keywords) {
  return new Promise((resolve, reject) => {
    if (keywords.length > 20) {
      resolve('Ezt én nem csinálom!');
      return;
    }

    console.log('Tuti keresés alapján: ' + keywords.join(' '));

    resolve(tutik.find(keywords) || 'Ilyen nincs bazmeg!');
  });
}

const byId = function (id) {
  console.log('Keresés ID alapján: ' + id);
  return new Promise((resolve, reject) => {
    resolve(tutik.get(id) || 'Ilyen nincs bazmeg!');
  });
}
