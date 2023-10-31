const path = require('path');
const fs = require("fs");
const sax = require("sax");
var jpconv = require('jp-conversion');

// http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz
const DICT_PATH = 'dictdata/JMdict_e';
const OUTPUT_PATH = path.join(__dirname, '../src/dictdata', 'JMdict_e.json');
const entries = [];

const saxStream = sax.createStream(false, {
  trim: true,
  normalize: true,
  lowercase: true,
});

saxStream.on("error", function (e) {
  // unhandled errors will throw, since this is a proper node
  // event emitter.
  console.error("error!", e);
  // clear the error
  this._parser.error = null;
  this._parser.resume();
});

let entry = null;
let nodeName = null;

saxStream.on("opentag", function (node) {
  nodeName = node.name;
  if (node.name === "entry") {
    entry = {};
  }
});

saxStream.on("text", function (text) {
  if (!entry) {
    return;
  }
  entry[nodeName] = text;
});

saxStream.on("closetag", function (name) {
  if (name === "entry") {
    processEntry(entry);
  }
});

saxStream.on('end', () => {
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2));
  console.log('done.')
})

function processEntry(entry) {
  const {
    keb,
    reb,
    gloss,
    pos,
  } = entry;
  entries.push({
    word: keb || reb,
    pron: reb,
    means: [{
      pos,
      expl: gloss,
    }],
    indexer: jpconv.romanise(reb),
  });
}

// pipe is supported, and it's readable/writable
// same chunks coming in also go out.
fs.createReadStream(DICT_PATH, { encoding: 'utf8' }).pipe(saxStream);
