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
  searchBoxInput.value = word;
  searchBoxInput.focus();
  emitChangeSerchTerm(word);
});

ipcRenderer.on(APP_EVENTS.ON_BROWSER_WINDOW_HIDE, () => {
  searchBoxInput.value = '';
  emitChangeSerchTerm('');
})

ipcRenderer.on(APP_EVENTS.UPDATE_SEARCH_RESULT, (event, results) => {
  console.log('set word entry children')
  const wordList = results.map((w) =>
    div('word-wrap',
      div('entry',
        span('word', text(w.word)),
        span('pron', text(w.pron)),
      ),
      div('mean',
        ...w.means.map((m) => div('mean', text(`${m.pos || ''} ${m.expl}`.trim())))
      ),
    ),
  );
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
