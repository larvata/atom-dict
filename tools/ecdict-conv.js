// https://github.com/skywind3000/ECDICT

const path = require('path');
const fs = require("fs");
const {parse} = require('csv-parse');
const { phoneticConvert } = require('./utils');

const DICT_PATH = 'dictdata/stardict.csv';
const OUTPUT_PATH = path.join(__dirname, '../src/dictdata', 'stardict.json');


const loadDict = () => {
  const entries = [];
  let count = 0;

  const parser = parse();

  parser.on('readable', () => {
    let record;
    while((record = parser.read()) !== null) {
      count += 1;
      if (count === 1) {
        continue;
      }

      const [
        word,
        phonetic,
        definition,
        translation,
        pos,
      ] = record;

      if (word.split('').some((c) => {
        const code = c.charCodeAt();
        return (code < 65 || (code > 90 && code < 97) || code > 122);
      })) {
        continue;
      }

      entries.push({
        word,
        pron: phoneticConvert(phonetic),
        means: [{
          expl: [definition, translation].filter((d) => d),
        }],
        indexer: [word.toLowerCase()],
      });
    }
  });

  parser.on('end', () => {
    fs.writeFileSync(OUTPUT_PATH,JSON.stringify(entries, null, 2));
    console.log("done");
  })

  fs.createReadStream(DICT_PATH).pipe(parser);
}


loadDict();
