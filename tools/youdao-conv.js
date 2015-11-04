var fs = require('fs');
var readline = require('readline');
var jpconv = require('jp-conversion');


var phoneticConvert = function(src){
  src=src.replace(/\[.*\]/,'').split('/').map(function(ele){
    if (ele.length !== 0) {
      return '[' + ele + ']';
    }
  }).join(' ');

  src=src
    .replace(/A/g,'æ')
    .replace(/B/g,'ɑ')
    .replace(/C/g,'ɛ')
    .replace(/D/g,'ː')
    .replace(/E/g,'ə')
    .replace(/F/g,'ʃ')
    .replace(/G/g,'ʒ')
    .replace(/H/g,'ɜː')
    .replace(/I/g,'ɪ')
    .replace(/J/g,'ʊ')
    .replace(/K/g,'ɝ')
    .replace(/L/g,'ɒ')
    .replace(/M/g,'ɚ')
    .replace(/N/g,'ŋ')
    .replace(/O/g,'ɔ')

    .replace(/R/g,'ʌ')
    .replace(/S/g,'ɝ')

    .replace(/\'/g,'ˈ')
    .replace(/\,/g,'ˌ');
  return src;
};



var loadDict = function(){
  var path = "#{__dirname}/../src/dict/youdao";
  var outPath =  "#{__dirname}/../src/dict/youdao_lite.json";
  var entries = [];

  fs.readFile(path,'utf8',function(err,data){
    var ret = data.split('\n');
    var conter = 0;
    ret.forEach(function(rowEntry){

      var array = rowEntry.split('\t');

      var entry = {
        word: array[0],
        pron: phoneticConvert(array[1]),
        mean: array[2],
        indexer: array[0].toLowerCase()
      };

      if (++conter===1) {
        console.log(entry)
      }

      entries.push(entry);
    });

    fs.writeFileSync(outPath,JSON.stringify(entries));
    console.log("done");
  });
};

loadDict();

