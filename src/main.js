// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  screen,
} = require('electron')
const path = require('node:path')

const {
  BROWSER_WINDOW_EVENTS,
  SHOW_WINDOW_HOT_KEY,
  APP_EVENTS,
} = require('./constants');

const {
  dictLines,
  loadDict,
} = require('./utils');

const mainWindowProps = {
  height: 80,
  width: 500,
  alwaysOnTop: true,
  frame: false,
  show: false,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true,
    contextIsolation: false,
  },
};

let mainWindow = null;
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow(mainWindowProps);

  // and load the index.html of the app.
  const html = path.join(__dirname, 'index.html');
  mainWindow.loadFile(html);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools({ mode: 'detach' })

  mainWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  });

  mainWindow.on(BROWSER_WINDOW_EVENTS.BLUR, () => {
    setBrowserVisibility(false);
  });

  globalShortcut.register(SHOW_WINDOW_HOT_KEY, () => {
    setBrowserVisibility(true);
  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const setBrowserPostion = () => {
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
    mainWindow.focus();
    mainWindow.webContents.send(APP_EVENTS.ON_BROWSER_WINDOW_SHOW);
  } else {
    mainWindow.hide();
    mainWindow.webContents.send(APP_EVENTS.ON_BROWSER_WINDOW_HIDE);
  }
};

ipcMain.on(APP_EVENTS.WINDOW_VISIBLE, (event, visibility) => {
  setBrowserVisibility(visibility);
});


ipcMain.on(APP_EVENTS.CHANGE_SEARCH_TERM, (event, keyword) => {
  let ret;
  if (keyword.length === 0) {
    ret = [];
  } else {
    const matches = dictLines.filter(dl => dl.indexer.some((ider) => ider.includes(keyword.toLowerCase())));
    ret = matches.filter(m => m.indexer.some((ider) => ider.startsWith(keyword.toLowerCase())))
      .sort()
      .slice(0, 25);
  }

  event.sender.send(APP_EVENTS.UPDATE_SEARCH_RESULT, ret);
});

ipcMain.on(APP_EVENTS.SET_ENTRY_HEIGHT, (event, options) => {
  const { appHeight } = options;

  const PADDING = 10;
  mainWindow.setSize(mainWindowProps.width, appHeight + PADDING)
})

setTimeout(() => {
  loadDict('JMdict_e');
  loadDict('moji');
  loadDict('stardict');
}, 1000)
