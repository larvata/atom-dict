const path = require('path');
const fs = require("fs");
const sax = require("sax");
const { default: Mdict } = require('js-mdict');

const DICT_PATH = 'dictdata/Oxford English Dictionary.mdx';
const OUTPUT_PATH = path.join(__dirname, '../src/dictdata', 'Oxford English Dictionary.json');

const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    const entry = {
      means: []
    };
    let flagPos = false;
    let nodeName = null;
    const parser = sax.parser();

    parser.onerror = function (e) {
      reject(e);
    };
    parser.onopentag = function (node) {
      nodeName = node.name;
      if (['DIV', 'LINK', 'SCRIPT', 'OED4'].includes(node.name)) {
        return;
      }

      console.log({node})
    }
    parser.onclosetag = function (node) {
      nodeName = null;
      console.log('close:', {node})
    }

    parser.ontext = function (text) {
      if (nodeName === 'HW') {
        // pron = text;
        entry.pron = text.trim();
        flagPos = true;
      } else if (nodeName === 'W' && flagPos) {
        flagPos = false;
        entry.pos = text;
        // let mean = entry.means.find((m) => m.pos === pos);
        // if (!mean) {
        //   mean = {
        //     pos,
        //     expl: []
        //   };
        //   entry.means.push(mean);
        // }
        // mean.expl.push(text);
      } else {
        console.log('unhandled:', {text});
        return;
      }

      textNodeName = null;
    };
    parser.onattribute = function (attr) {
      const { name, value } = attr;



      // if (name === 'REL' && value === 'stylesheet') {
      //   return;
      // }

      // if (name === 'TYPE' && value === 'text/css') {
      //   return;
      // }

      // if (name === 'HREF') {
      //   return;
      // }

      // if (name === 'CLASS' && value.startsWith('sentence_')) {
      //   return;
      // }

      // if (name === 'CLASS' && value === 'cixingtiaozhuan') {
      //   return;
      // }

      // if (name === 'CLASS' && value === 'cixingtiaozhuan_part') {
      //   return;
      // }

      // if (name === 'CLASS' && value === 'explanation') {
      //   textNodeName = 'explanation';
      //   return;
      // }

      // if (name === 'CLASS' && value === 'cixing_title') {
      //   textNodeName = 'pos';
      //   return;
      // }

      console.log({attr})
    };
    parser.onend = function () {
      resolve(entry);
    };

    parser.write(xml).close();
  });
}


(async () => {
  const entries = [];
  const dict = new Mdict(DICT_PATH);

  console.log('length:', dict.keyList.length)
  for (let i = 130; i < dict.keyList.length - 1; i += 1) {
    if (i % 10000 === 0) {
      console.log('i:', i)
    }
    const key = dict.keyList[i];

    const data = dict.fetch_defination(key);
    const { keyText, definition } = data;
    console.log(data)

console.log('------------')
    const parsed = await parseXML(`<div>${definition}</div>`);
    console.log('============')
    console.log({parsed})
    process.exit();
    // console.log(data)
  }
})();
