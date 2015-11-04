var fs = require('fs');
var readline = require('readline');
var jpconv = require('jp-conversion');

var loadDict = function(){
  var path = "#{__dirname}/../src/dict/edict2u";
  var outPath =  "#{__dirname}/../src/dict/edict2u_lite.json";
  var entries = [];

  fs.readFile(path,'utf8',function(err,data){
    var ret = data.split('\n');
    ret.forEach(function(rowEntry){
      var array = rowEntry.split('/');

      var wmatch = array[0].match(/(\S+)\s\[(\S+)\]/);
      var pron,word;
      if (wmatch) {
        pron = wmatch[2];
        word = wmatch[1];
      }
      else{
        pron = '';
        word = array[0];
      }
      var entry = {
        word: word,
        pron: pron,
        mean: array.slice(1,array.length-2).join(','),
        indexer: jpconv.romanise(pron||word)
      };

      entries.push(entry);
    });

    fs.writeFileSync(outPath,JSON.stringify(entries));
    console.log("done")
  });
};

loadDict();

