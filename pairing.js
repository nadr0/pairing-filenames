const path = require('path');
const shortid = require('shortid');
const { 
  rename,
  getStats,
  filteredFiles
 } = require('./helpers.js');

/**
 * @param {String} directory - absolute path to the directory to get a list of files
 * @param {Number} numberOfPairs
 * @param {String} prefix - Added to the start of the new paired files
 */
const pair = async (directory, numberOfPairs, prefix) => {
  const files = await filteredFiles(directory, prefix);
  if (!files.length) {
    console.log('No files processed.');
    return;
  }
  const paths = files.map((file) => {
    return {
      absPath: path.join(directory, file),
      name: file
    } 
  });
  // ls the directory and sort by birthtime
  const statPromises = paths.map(({absPath, name}) => {
    return new Promise( async (resolve, reject) => {
      try {
        const {birthtime} = await getStats(absPath);
        resolve({
          name,
          birthtime
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  });

  const filesWithBirthTime = await Promise.all(statPromises);
  const sortedFiles = filesWithBirthTime.sort((a,b)=>{
    return b.birthtime < a.birthtime;
  });

  for (let i = 0; i < numberOfPairs; i++) {
    const { name: fileNameOne } = sortedFiles[i];
    const { name: fileNameTwo } = sortedFiles[i + numberOfPairs];

    const id = shortid.generate();
    
    const newFileNameOne = `${prefix}${id}__${fileNameOne}`;
    const newFileNameTwo = `${prefix}${id}__${fileNameTwo}`;

    const absFileNameOne = path.join(directory, fileNameOne);
    const absFileNameTwo = path.join(directory, fileNameTwo);

    const absNewFileNameOne = path.join(directory, newFileNameOne);
    const absNewFileNameTwo = path.join(directory, newFileNameTwo);

    await rename(absFileNameOne, absNewFileNameOne);
    await rename(absFileNameTwo, absNewFileNameTwo);
  }
};

module.exports = {
  pair
};