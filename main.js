const fs = require('fs');
const _ = require('underscore');

const electron = require('electron');

const {app, BrowserWindow, globalShortcut} = electron;

const APP_EVENTS={
  'WINDOW_ALL_CLOSED': 'window-all-closed',
  'READY': 'ready',
  'KEY_UP': 'keyup',
  'WINDOW_VISIBLE': 'windowVisible',
  'WINDOW_RESULT_HEIGHT': 'windowResultHeight'
};

const BROWSER_WINDOW_EVENTS = {
  'CLOSED': 'closed',
  'BLUR': 'blur'
};

const SHOW_WINDOW_HOT_KEY = 'shift+ctrl+space';

const mainWindowProps = {
  height: 80,
  width: 500,
  alwaysOnTop: true,
  frame: false
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
app.on('ready', createWindow);
app.on('window-all-closed', ()=>{
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on(APP_EVENTS.KEY_UP, (keyword)=>{
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
});

app.on(APP_EVENTS.WINDOW_VISIBLE, (visibility)=>{
  setBrowserVisibility(visibility);
});

app.on(APP_EVENTS.WINDOW_RESULT_HEIGHT, (height)=>{
  const maxHeight = 500;

  while (height > maxHeight) {
    height -= 82;
  }

  mainWindow.setSize(mainWindowProps.width, height);
});
