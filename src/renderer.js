/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const {
  ipcRenderer,
  clipboard,
} = require('electron');
const {
  div,
  span,
  text,
  input,
} = require('./dom');
const {
  APP_EVENTS,
  UI_ENTRY_MAX_HEIGHT,
} = require('./constants');

const searchBoxInput = input('search-box');
const searchBox = div('search-part', searchBoxInput);
const entryContainer = div('word-container');
const app = div('app', searchBox, entryContainer);

const MARKDOWN_ICON = `<svg fill="#000000" width="16px" height="16px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><path d="M22.269 19.385H1.731a1.73 1.73 0 0 1-1.73-1.73V6.345a1.73 1.73 0 0 1 1.73-1.73h20.538a1.73 1.73 0 0 1 1.73 1.73v11.308a1.73 1.73 0 0 1-1.73 1.731zm-16.5-3.462v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.461v7.847zM21.231 12h-2.308V8.077h-2.307V12h-2.308l3.461 4.039z"/></svg>`;
const ANKI_ICON = `<svg height="16" width="16" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><linearGradient id="a"><stop offset="0" stop-color="#00a9ff"/><stop offset="1" stop-color="#00d6ff"/></linearGradient><linearGradient id="b"><stop offset="0" stop-color="#fefefe"/><stop offset="1" stop-color="#fefefe" stop-opacity="0"/></linearGradient><linearGradient id="c" gradientUnits="userSpaceOnUse" x1="36.357143" x2="36.357143" xlink:href="#b" y1="6" y2="63.893143"/><radialGradient id="d" cx="48" cy="90.171875" gradientTransform="matrix(1.1573129 0 0 .99590774 -7.551021 .197132)" gradientUnits="userSpaceOnUse" r="42" xlink:href="#b"/><linearGradient id="e" gradientTransform="scale(1.0058652 .994169)" gradientUnits="userSpaceOnUse" x1="48" x2="48" y1="90" y2="5.987717"><stop offset="0" stop-color="#323232"/><stop offset="1" stop-color="#505050" stop-opacity=".968627"/></linearGradient><linearGradient id="f" gradientTransform="matrix(1.0058652 0 0 .994169 100 0)" gradientUnits="userSpaceOnUse" x1="45.447727" x2="45.447727" y1="92.539597" y2="7.01654"><stop offset="0"/><stop offset="1" stop-opacity=".588235"/></linearGradient><linearGradient id="g" gradientTransform="matrix(1.0238095 0 0 1.0119048 -1.142857 -98.071429)" gradientUnits="userSpaceOnUse" x1="32.251034" x2="32.251034" xlink:href="#f" y1="6.131708" y2="90.238609"/><linearGradient id="h" gradientTransform="translate(0 -97)" gradientUnits="userSpaceOnUse" x1="32.251034" x2="32.251034" xlink:href="#f" y1="6.131708" y2="90.238609"/><linearGradient id="i" gradientUnits="userSpaceOnUse" x1="13.307925" x2="52.55184" xlink:href="#a" y1="59.909482" y2="59.909482"/><linearGradient id="j" gradientUnits="userSpaceOnUse" x1="47.71204167311" x2="77.7120434279" xlink:href="#a" y1="27.76647357489" y2="27.76647357489"/><g><g fill="url(#g)"><path d="m12-95.03125c-5.5110903 0-10.03125 4.52016-10.03125 10.03125v71c0 5.5110902 4.5201598 10.03125 10.03125 10.03125h72c5.51109 0 10.03125-4.5201597 10.03125-10.03125v-71c0-5.51109-4.52016-10.03125-10.03125-10.03125z" opacity=".08" transform="scale(1 -1)"/><path d="m12-94.03125c-4.971633 0-9.03125 4.059617-9.03125 9.03125v71c0 4.9716329 4.0596171 9.03125 9.03125 9.03125h72c4.971633 0 9.03125-4.059617 9.03125-9.03125v-71c0-4.971633-4.059617-9.03125-9.03125-9.03125z" opacity=".1" transform="scale(1 -1)"/><path d="m12-93c-4.4091333 0-8 3.590867-8 8v71c0 4.4091333 3.5908667 8 8 8h72c4.409133 0 8-3.5908667 8-8v-71c0-4.409133-3.590867-8-8-8z" opacity=".2" transform="scale(1 -1)"/><rect height="85" opacity=".3" rx="7" transform="scale(1 -1)" width="86" x="5" y="-92"/></g><rect fill="url(#h)" height="84" opacity=".45" rx="6" transform="scale(1 -1)" width="84" x="6" y="-91"/></g><rect fill="url(#e)" height="84" rx="6" width="84" x="6" y="6"/><path d="m12 6c-3.324 0-6 2.676-6 6v2 68 2c0 .334721.04135.6507.09375.96875.0487.295596.09704.596915.1875.875.00988.03038.020892.0636.03125.09375.098865.287771.2348802.547452.375.8125.1445918.273507.3156161.535615.5.78125s.3737765.473472.59375.6875c.439947.428056.94291.814526 1.5 1.09375.278545.139612.5734731.246947.875.34375-.2562018-.100222-.4867109-.236272-.71875-.375-.00741-.0044-.023866.0045-.03125 0-.031933-.0193-.062293-.04251-.09375-.0625-.120395-.0767-.2310226-.163513-.34375-.25-.1061728-.0808-.2132809-.161112-.3125-.25-.1779299-.161433-.3474596-.345388-.5-.53125-.1075789-.130255-.2183939-.265285-.3125-.40625-.025089-.03838-.038446-.08587-.0625-.125-.064763-.103032-.1302275-.204517-.1875-.3125-.1010083-.194706-.2056748-.415701-.28125-.625-.00796-.02181-.023589-.04055-.03125-.0625-.0318251-.09195-.0358045-.186831-.0625-.28125-.0303323-.106618-.0703894-.203031-.09375-.3125-.0728786-.341512-.125-.698205-.125-1.0625v-2-68-2c0-2.781848 2.2181517-5 5-5h2 68 2c2.781848 0 5 2.218152 5 5v2 68 2c0 .364295-.05212.720988-.125 1.0625-.04415.206893-.08838.397658-.15625.59375-.0077.02195-.0233.04069-.03125.0625-.06274.173739-.138383.367449-.21875.53125-.04158.0828-.07904.169954-.125.25-.0546.09721-.126774.18835-.1875.28125-.09411.140965-.204921.275995-.3125.40625-.143174.17445-.303141.346998-.46875.5-.01117.0102-.01998.02115-.03125.03125-.138386.125556-.285091.234436-.4375.34375-.102571.07315-.204318.153364-.3125.21875-.0074.0045-.02384-.0044-.03125 0-.232039.138728-.462548.274778-.71875.375.301527-.0968.596455-.204138.875-.34375.55709-.279224 1.060053-.665694 1.5-1.09375.219973-.214028.409366-.441865.59375-.6875s.355408-.507743.5-.78125c.14012-.265048.276135-.524729.375-.8125.01041-.03078.02133-.06274.03125-.09375.09046-.278085.1388-.579404.1875-.875.0524-.31805.09375-.634029.09375-.96875v-2-68-2c0-3.324-2.676-6-6-6z" fill="url(#c)" opacity=".2"/><path d="m12 90c-3.324 0-6-2.676-6-6v-2-68-2c0-.334721.04135-.6507.09375-.96875.0487-.295596.09704-.596915.1875-.875.00988-.03038.020892-.0636.03125-.09375.098865-.287771.2348802-.547452.375-.8125.1445918-.273507.3156161-.535615.5-.78125s.3737765-.473472.59375-.6875c.439947-.428056.94291-.814526 1.5-1.09375.278545-.139612.5734731-.246947.875-.34375-.2562018.100222-.4867109.236272-.71875.375-.00741.0044-.023866-.0045-.03125 0-.031933.0193-.062293.04251-.09375.0625-.120395.0767-.2310226.163513-.34375.25-.1061728.0808-.2132809.161112-.3125.25-.1779299.161433-.3474596.345388-.5.53125-.1075789.130255-.2183939.265285-.3125.40625-.025089.03838-.038446.08587-.0625.125-.064763.103032-.1302275.204517-.1875.3125-.1010083.194706-.2056748.415701-.28125.625-.00796.02181-.023589.04055-.03125.0625-.0318251.09195-.0358045.186831-.0625.28125-.0303323.106618-.0703894.203031-.09375.3125-.0728786.341512-.125.698205-.125 1.0625v2 68 2c0 2.781848 2.2181517 5 5 5h2 68 2c2.781848 0 5-2.218152 5-5v-2-68-2c0-.364295-.05212-.720988-.125-1.0625-.04415-.206893-.08838-.397658-.15625-.59375-.0077-.02195-.0233-.04069-.03125-.0625-.06274-.173739-.138383-.367449-.21875-.53125-.04158-.0828-.07904-.169954-.125-.25-.0546-.09721-.126774-.18835-.1875-.28125-.09411-.140965-.204921-.275995-.3125-.40625-.143174-.17445-.303141-.346998-.46875-.5-.01117-.0102-.01998-.02115-.03125-.03125-.138386-.125556-.285091-.234436-.4375-.34375-.102571-.07315-.204318-.153364-.3125-.21875-.0074-.0045-.02384.0044-.03125 0-.232039-.138728-.462548-.274778-.71875-.375.301527.0968.596455.204138.875.34375.55709.279224 1.060053.665694 1.5 1.09375.219973.214028.409366.441865.59375.6875s.355408.507743.5.78125c.14012.265048.276135.524729.375.8125.01041.03078.02133.06274.03125.09375.09046.278085.1388.579404.1875.875.0524.31805.09375.634029.09375.96875v2 68 2c0 3.324-2.676 6-6 6z" fill="url(#d)" opacity=".2"/><g stroke="#00e4ff"><path d="m49.435337 73.923696-12.923838-3.531905-10.236221 8.644058-.634644-13.382719-11.384155-7.064063 12.531607-4.739071 3.200426-13.00989 8.379603 10.453813 13.362127-.976491-7.352727 11.199882z" fill="url(#i)" stroke-width=".843553"/><path d="m75.329628 38.479634-9.879625-2.699964-7.825076 6.607948-.485154-10.230416-8.702614-5.400122 9.579784-3.622781 2.446565-9.945407 6.405785 7.991415 10.214674-.746478-5.62079 8.561746z" fill="url(#j)" stroke-width=".644854"/></g></svg>`;

function emitChangeSerchTerm(serchTerm) {
  ipcRenderer.send(APP_EVENTS.CHANGE_SEARCH_TERM, serchTerm);
}

searchBoxInput.addEventListener('keyup', (event) => {
  emitChangeSerchTerm(event.target.value);
})

app.addEventListener('keyup', (event) => {
  const { keyCode } = event;
  if (keyCode === 27) {
    // ESC was pressed
    ipcRenderer.send(APP_EVENTS.WINDOW_VISIBLE, false);
  }
})

const root = document.getElementById('root');
root.appendChild(app);

ipcRenderer.on(APP_EVENTS.ON_BROWSER_WINDOW_SHOW, () => {
  const word = clipboard.readText('string').trim();
  if (word.length > 20) {
    return;
  }
  searchBoxInput.value = word;
  searchBoxInput.focus();
  searchBoxInput.select();
  emitChangeSerchTerm(word);
});

ipcRenderer.on(APP_EVENTS.ON_BROWSER_WINDOW_HIDE, () => {
  searchBoxInput.value = '';
  emitChangeSerchTerm('');
})

ipcRenderer.on(APP_EVENTS.UPDATE_SEARCH_RESULT, (event, results) => {
  console.log('set word entry children')
  const wordList = results.map((w) => {
    const means = [];

    const markdown = [`**${w.word}** *${w.pron}*`];
    w.means.forEach((mean) => {
      mean.expl.forEach((expl) => {
        `${mean.pos || ''}${expl}`.split('\\n').forEach((l) => {
          markdown.push(`- ${l.trim()}`);
          means.push(div('', text(l.trim())));
        })
      })
    });
    markdown.push('');
    markdown.push('');

    let pron = w.pron || '';
    if (pron && !pron.startsWith('[')) {
      pron = `[${pron}]`;
    }
    const ankiBody = {
      action: 'addNote',
      params: {
        note: {
          deckName: 'Default',
          modelName: 'Basic',
          fields: {
            Front: `<b>${w.word}</b>`,
          Back: `
<span style="font-size:16px">${pron}</span>
<ul>
  ${w.means.reduce((acc, mean) => {
    mean.expl.forEach((expl) => {
      `${mean.pos || ''}${expl}`.split('\\n').forEach((l) => {
        acc.push(l)
      })
    });
    return acc;
  }, []).map((l) => `<li><span style="font-size:16px">${l}</span></li>`).join('')}
</ul>`
          }
        }
      }
    };

    return div('word-wrap',
      div('entry',
        span('word',
          span('',
            text(w.word)
          ),
          span({
            className: 'btn-copy-as-markdown action-button',
            innerHTML: MARKDOWN_ICON,
            onClick: () => {
              navigator.clipboard.writeText(markdown.join('\n'));
              searchBoxInput.focus();
            }
          }),
          span({
            className: 'btn-add-to-anki action-button',
            innerHTML: ANKI_ICON,
            onClick: (event) => {
              event.preventDefault();
              fetch('http://localhost:8765', {
                method: 'POST',
                body: JSON.stringify(ankiBody)
              });
              searchBoxInput.focus();
            }
          }),
        ),
        span('pron', text(pron)),
      ),
      div('mean',
        ...means
      ),
    )
  });
  entryContainer.replaceChildren(...wordList);

  // update search content size
  const maxHeight = (entryContainer.scrollHeight > UI_ENTRY_MAX_HEIGHT)
    ? UI_ENTRY_MAX_HEIGHT
    : entryContainer.scrollHeight;
  entryContainer.style.maxHeight = `${maxHeight}px`;

  ipcRenderer.send(APP_EVENTS.SET_ENTRY_HEIGHT, {
    appHeight: app.clientHeight,
  });
});
