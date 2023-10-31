const path = require('path');
const fs = require("fs");
const sax = require("sax");
const { default: Mdict } = require('js-mdict');
var jpconv = require('jp-conversion');

const DICT_PATH = 'dictdata/moji.mdx';
const OUTPUT_PATH = path.join(__dirname, '../src/dictdata', 'moji.json');

const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    const entry = {
      means: []
    };
    let textNodeName = null;
    let pos = null;
    const parser = sax.parser();

    parser.onerror = function (e) {
      reject(e);
    };
    parser.ontext = function (text) {
      if (!textNodeName) {
        // console.log({text});
        return;
      }

      if (textNodeName === 'pos') {
        pos = text;
      } else if (textNodeName === 'explanation') {
        let mean = entry.means.find((m) => m.pos === pos);
        if (!mean) {
          mean = {
            pos,
            expl: []
          };
          entry.means.push(mean);
        }
        mean.expl.push(text);
      } else {
        console.log('unhandled:', {text});
        return;
      }

      textNodeName = null;
    };
    parser.onattribute = function (attr) {
      const { name, value } = attr;

      if (name === 'REL' && value === 'stylesheet') {
        return;
      }

      if (name === 'TYPE' && value === 'text/css') {
        return;
      }

      if (name === 'HREF') {
        return;
      }

      if (name === 'CLASS' && value.startsWith('sentence_')) {
        return;
      }

      if (name === 'CLASS' && value === 'cixingtiaozhuan') {
        return;
      }

      if (name === 'CLASS' && value === 'cixingtiaozhuan_part') {
        return;
      }

      if (name === 'CLASS' && value === 'explanation') {
        textNodeName = 'explanation';
        return;
      }

      if (name === 'CLASS' && value === 'cixing_title') {
        textNodeName = 'pos';
        return;
      }

      // console.log({attr})
    };
    parser.onend = function () {
      resolve(entry);
    };

    parser.write(xml).close();
  });
}

true && (async () => {
  const cache = {};
  const entries = [];
  const dict = new Mdict(DICT_PATH);

  console.log('length:', dict.keyList.length)
  for (let i = 0; i < dict.keyList.length - 1; i += 1) {
    if (i % 10000 === 0) {
      console.log('i:', i)
    }
    const key = dict.keyList[i];

    const data = dict.fetch_defination(key);
    const { keyText, definition } = data;

    const isIndex = definition.startsWith('@@@LINK=');
    if (isIndex) {
      continue;
    }

    const [word, p2] = keyText.split('【');
    let pron = null;
    if (p2) {
      pron = p2.slice(0, -1);
    }

    if (/^[a-zA-Z]+$/.test(word)) {
      continue;
    }

    // if (keyText.includes('ありざりん') || definition.includes('ありざりん')) {
    //   console.log(data)
    // }

    let entry = cache[word];
    if (!entry) {
      // console.log({word, pron, data})
      entry = {
        word,
        pron,
        indexer: jpconv
          .romanise(pron || word)
          .replace(/[◎①②③④⑤⑥]/, () => ''),
      };
      cache[word] = entry;
    }

    if (!isIndex) {
      // parse details
      const ent = await parseXML(definition);
      Object.assign(entry, ent)
    }
  }

  Object.keys(cache).forEach((key) => {
    const entry = cache[key];
    if (!entry.word) {
      return;
    }
    if (!entry.means.length) {
      return;
    }

    entries.push(cache[key])
  });

  console.log('output:', entries.length);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2))
})();


// const dict = new Mdict('dictdata/moji.mdx');
// dict.fuzzy_search('いたたまれない', 3, 1).forEach((k) => {
//   console.log(dict.fetch_defination(k))
// })


// parseXML(`<link rel="stylesheet" type="text/css" href="mojicishu.css"><h3 class="entry_name">大【だい①】</h3><div class="cixingtiaozhuan"><span class="cixingtiaozhuan_part"><a href="#bE5BDA2E58AA8C2B7E5908D">形动·名</a></span><span class="cixingtiaozhuan_part"><a href="#bE683AFE794A8E8AFAD">惯
//   语</a></span></div><div class="cixing"><div id="bE5BDA2E58AA8C2B7E5908D" class="cixing_title">形动·名</div><div class="explanation">大。（大小がある
//   ののうち、大きい方のもの。）</div><div class="sentence"><div class="sentence_o">声を大にする</div><div class="sentence_t">放大声音。</div></div><div class="sentence"><div class="sentence_o">サイズは大,中,小がある</div><div class="sentence_t">分为大，中，小（三种）尺码〔型号〕。</div></div><div class="explanation">多，大量。（数量や形、範囲、規範などが大きいこと。）</div><div class="sentence"><div class="sentence_o">京都より東京のほうが人口が大
//   </div><div class="sentence_t">东京的人口比京都的多。</div></div><div class="explanation">优越，好。（立派。一人前。）</div><div class="sentence"><div class="sentence_o">よく大を成した</div><div class="sentence_t">干得出色；很有成就。</div></div><div class="explanation">非常，很，极度。（非常に）</div><div class="sentence"><div class="sentence_o">あのふたりは大のなかよしだ</div><div class="sentence_t">那两人很要好。</div></div><div class="sentence"><div class="sentence_o">彼は大のたばこ好きだ</div><div class="sentence_t">他是非常爱好吸烟的人。</div></div><div class="explanation">大月；大建，
//   尽。（大の月）</div><div class="sentence"><div class="sentence_o">今月は大の月だ</div><div class="sentence_t">这个月是大月〔大建〕。</div></div></div><div class="cixing"><div id="bE683AFE794A8E8AFAD" class="cixing_title">惯用语</div><div class="explanation">大なり小なり/或大或小。无论大小。（大き
//   ろうが小さかろうが。程度の差はあっても。）</div></div>\r\n`).then((r) => {
//     console.log(r.means);
//   })
