const patrikFn = require('./assets/js/functions');
const patrikok = require('./assets/js/patrikok');

const args = process.argv.slice(2);


let index = patrikFn.getDefaultOffset() % patrikok.length;

if (args.length && args[0] === '--index') {
  console.log(index);
} else {
  console.log(patrikok[index]);
}
