const phoneticConvert = function(src){
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

    .replace(/'/g,'ˈ')
    .replace(/,/g,'ˌ');
  return src;
};

const uniq = (arr) => {
  return [...new Set(arr.filter((a) => a))];
}

module.exports = {
  phoneticConvert,
  uniq,
};
