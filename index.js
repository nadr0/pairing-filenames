const path = require('path');
const { 
  pair
 } = require('./pairing.js');

const args = process.argv.slice(2);

if (args.length !== 1) {
  throw 'No path provided.';
}

const directory = args[0];

const start = async () => {
  // change number of pairs or prefix
  const prefix = '__INSTAX__';
  await pair(directory, 4, prefix);
};

start();