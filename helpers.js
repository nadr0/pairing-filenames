const fs = require('fs');

const rename = async (oldName, newName) => {
  return new Promise( (resolve, reject) => {
    fs.rename(oldName, newName, function (err, __) {
      if (err) {
        return reject(err);
      }
      return resolve(__);
    });
  });
  return await fs.rename(oldName, newName);
};

/**
 * Return an array of filename strings for a given directory
 * @param {String} directory - absolute path to the directory to get a list of files
 * @return {Array} An array of filenames under the directory
 */
const getFiles = (directory) => {
  return new Promise( (resolve, reject) => {
    fs.readdir(directory, function (err, files) {
      if (err) {
        console.error(err);
        return reject(err);
      }
      return resolve(files);
    });
  });
}; 

const filteredFiles = async (directory, prefix) => {
  const files = await getFiles(directory);
  return files.filter((file)=>{
    return !file.includes(prefix);
  });
};

const getStats = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      return resolve(stats);
    });
  });
};

module.exports = {
  rename,
  getFiles,
  getStats,
  filteredFiles
};