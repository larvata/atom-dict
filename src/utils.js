const fs = require('fs');

const dictLines = [];
const loadDict = (dictName, lang) => {
  const path = `${__dirname}/dictdata/${dictName}.json`;
  fs.readFile(path, 'utf8', (err, data) => {
    const json = JSON.parse(data);
    json.forEach((entry) => {
      dictLines.push({...entry, lang});
    });
  });
};

module.exports = {
  loadDict,
  dictLines
};
