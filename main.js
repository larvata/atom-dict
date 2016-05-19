import fs from 'fs';
import _ from 'underscore';
import electron, {app, BrowserWindow, globalShortcut} from 'electron';

import {
  BROWSER_WINDOW_EVENTS,
  SHOW_WINDOW_HOT_KEY,
  APP_EVENTS,
  WORD_ENTITY_HEIGHT,
  SEARCH_BOX_HEIGHT
} from './common/const';

const mainWindowProps = {
  height: 80,
  width: 500,
  alwaysOnTop: true,
  frame: false,
  show: false
};

let mainWindow;
let dictLines = [];
const loadDict=(dictName)=>{
  let path = `${__dirname}/dict/${dictName}.json`;
  fs.readFile(path, 'utf8', (err, data)=>{
    let json = JSON.parse(data);
    json.forEach(entry=>{
      dictLines.push(entry);
    });
  });
};
loadDict('youdao_lite');
loadDict('edict2u_lite');

const setBrowserPostion=()=>{
  const screen = electron.screen;
  let cursor = screen.getCursorScreenPoint();

  let currentDisplay = screen.getDisplayMatching({
    x: cursor.x,
    y:cursor.y,
    width:0,
    height:0
  });

  mainWindowProps.x = currentDisplay.bounds.x + (currentDisplay.bounds.width - mainWindowProps.width) / 2;
  mainWindowProps.y = currentDisplay.bounds.y + (currentDisplay.bounds.height - mainWindowProps.height) / 2;
  mainWindow.setPosition(mainWindowProps.x, mainWindowProps.y);
};

const setBrowserVisibility=(visibility)=>{
  if (visibility) {
    setBrowserPostion();
    mainWindow.show();
    app.emit('onBrowserWindowShow');
  }
  else{
    app.emit('onBrowserWindowHide');
    mainWindow.hide();
  }
};


const createWindow=()=>{
  mainWindow = new BrowserWindow(mainWindowProps);


  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', ()=>{
    mainWindow = null;
  });

  mainWindow.on(BROWSER_WINDOW_EVENTS.BLUR, ()=>{
    setBrowserVisibility(false);
  });

  globalShortcut.register(SHOW_WINDOW_HOT_KEY, ()=>{
    setBrowserVisibility(true);
  });
};

// init app
app.dock.hide();
app.on(APP_EVENTS.READY, createWindow);
app.on(APP_EVENTS.WINDOW_ALL_CLOSED, ()=>{
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on(APP_EVENTS.CHANGE_SEARCH_TERM, (keyword)=>{
  let ret;
  if (keyword.length === 0) {
    ret = [];
  }
  else{
    ret = _.chain(dictLines)
      .filter(dict=>{
        return dict.indexer.indexOf(keyword.toLowerCase()) === 0;
      })
      .sortBy(word=>word.word.length)
      .take(4).value();
  }

  app.emit('updateSearchResult', ret);

  // set window height
  let resultsHeight = ret.length * WORD_ENTITY_HEIGHT + SEARCH_BOX_HEIGHT;
  mainWindow.setSize(mainWindowProps.width, resultsHeight);

});

app.on(APP_EVENTS.WINDOW_VISIBLE, (visibility)=>{
  setBrowserVisibility(visibility);
});
