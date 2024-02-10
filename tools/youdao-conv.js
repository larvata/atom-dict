const path = require('path');
const fs = require('fs');
const { phoneticConvert } = require('./utils');

const DICT_PATH = 'dictdata/youdao';
const OUTPUT_PATH = path.join(__dirname, '../src/dictdata', 'youdao.json');

const loadDict = function(){
  var entries = [];

  fs.readFile(DICT_PATH,'utf8',function(err,data){
    var ret = data.split('\n');
    var conter = 0;
    ret.forEach(function(rowEntry){

      var array = rowEntry.split('\t');

      var entry = {
        word: array[0],
        pron: phoneticConvert(array[1]),
        means: [{
          expl: [array[2]],
        }],
        indexer: [array[0].toLowerCase()]
      };

      if (++conter===1) {
        console.log(entry)
      }

      entries.push(entry);
    });

    fs.writeFileSync(OUTPUT_PATH,JSON.stringify(entries, null, 2));
    console.log("done");
  });
};

loadDict();

