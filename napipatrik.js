const patrikFn = require('./assets/js/functions');
const patrikok = require('./assets/js/patrikok');


let index = patrikFn.getDefaultOffset() % patrikok.length;
console.log(patrikok[index]);

