const electron = require('electron');
const fs = require('fs');

const {
  app,
  BrowserWindow,
  globalShortcut,
} = electron;

const {
  BROWSER_WINDOW_EVENTS,
  SHOW_WINDOW_HOT_KEY,
  APP_EVENTS,
  WORD_ENTITY_HEIGHT,
  SEARCH_BOX_HEIGHT,
} = require('./common/constants');

const mainWindowProps = {
  height: 80,
  width: 500,
  alwaysOnTop: true,
  frame: false,
  show: false,
  webPreferences: {
    nodeIntegration: true,
  },
};

let mainWindow;
const dictLines = [];
const loadDict = (dictName) => {
  const path = `${__dirname}/dict/${dictName}.json`;
  fs.readFile(path, 'utf8', (err, data) => {
    const json = JSON.parse(data);
    json.forEach((entry) => {
      dictLines.push(entry);
    });
  });
};
loadDict('youdao_lite');
loadDict('edict2u_lite');

const setBrowserPostion = () => {
  const { screen } = electron;
  const cursor = screen.getCursorScreenPoint();

  const currentDisplay = screen.getDisplayMatching({
    x: cursor.x,
    y: cursor.y,
    width: 0,
    height: 0,
  });

  mainWindowProps.x = currentDisplay.bounds.x
    + ((currentDisplay.bounds.width - mainWindowProps.width) / 2);
  mainWindowProps.y = currentDisplay.bounds.y
    + ((currentDisplay.bounds.height - mainWindowProps.height) / 2);
  mainWindow.setPosition(mainWindowProps.x, mainWindowProps.y);
};

const setBrowserVisibility = (visibility) => {
  if (visibility) {
    setBrowserPostion();
    mainWindow.show();
    app.emit('onBrowserWindowShow');
  } else {
    app.emit('onBrowserWindowHide');
    mainWindow.hide();
  }
};


const createWindow = () => {
  mainWindow = new BrowserWindow(mainWindowProps);

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on(BROWSER_WINDOW_EVENTS.BLUR, () => {
    setBrowserVisibility(false);
  });

  globalShortcut.register(SHOW_WINDOW_HOT_KEY, () => {
    setBrowserVisibility(true);
  });
};

// init app
app.dock.hide();
app.on(APP_EVENTS.READY, createWindow);
app.on(APP_EVENTS.WINDOW_ALL_CLOSED, () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on(APP_EVENTS.CHANGE_SEARCH_TERM, (keyword) => {
  let ret;
  if (keyword.length === 0) {
    ret = [];
  } else {
    // ret = dictLines.filter(dl => dl.indexer.includes(keyword.toLowerCase())).sort((a, b) => a.length - b.length).slice(0, 4);
    const matches = dictLines.filter(dl => dl.indexer.includes(keyword.toLowerCase()));
    ret = matches.filter(m => m.indexer.startsWith(keyword.toLowerCase())).sort().slice(0, 4);
  }

  app.emit('updateSearchResult', ret);

  // set window height
  const resultsHeight = (ret.length * WORD_ENTITY_HEIGHT) + SEARCH_BOX_HEIGHT;
  mainWindow.setSize(mainWindowProps.width, resultsHeight);
});

app.on(APP_EVENTS.WINDOW_VISIBLE, (visibility) => {
  setBrowserVisibility(visibility);
});
