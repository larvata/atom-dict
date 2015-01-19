// Generated by CoffeeScript 1.8.0
var BrowserWindow, app, ce, dictLines, ec, fs, globalShortcut, loadDict, loadEdictDict, loadYodaoDict, mainWindow, mainWindowSize, phoneticConvert, setBrowserVisibility, stream, _;

app = require('app');

_ = require('underscore');

fs = require('fs');

globalShortcut = require('global-shortcut');

BrowserWindow = require('browser-window');

require('crash-reporter').start();

ec = null;

ce = null;

phoneticConvert = function(src) {
  src = src.replace(/\[.*\]/, '').split('/').map(function(ele) {
    if (ele.length !== 0) {
      return "[" + ele + "]";
    }
  }).join(' ');
  return src = src.replace(/A/g, 'æ').replace(/B/g, 'ɑ').replace(/C/g, 'ɛ').replace(/D/g, 'ː').replace(/E/g, 'ə').replace(/F/g, 'ʃ').replace(/G/g, 'ʒ').replace(/H/g, 'ɜː').replace(/I/g, 'ɪ').replace(/J/g, 'ʊ').replace(/K/g, 'ɝ').replace(/L/g, 'ɒ').replace(/M/g, 'ɚ').replace(/N/g, 'ŋ').replace(/O/g, 'ɔ').replace(/R/g, 'ʌ').replace(/S/g, 'ɝ');
};

stream = null;

dictLines = [];

loadYodaoDict = function() {
  var remaining, streamOptions;
  streamOptions = {
    encoding: 'utf8'
  };
  stream = fs.createReadStream("" + __dirname + "/dict/ec.txt");
  remaining = '';
  stream.on('data', function(data) {
    var arr, index, line, _results;
    remaining += data;
    index = remaining.indexOf('\n');
    _results = [];
    while (index > 1) {
      line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      arr = line.split('\t');
      dictLines.push({
        word: arr[0],
        pron: phoneticConvert(arr[1]),
        mean: arr[2]
      });
      _results.push(index = remaining.indexOf('\n'));
    }
    return _results;
  });
  return stream.on('end', function() {
    var arr;
    if (remaining.length > 0) {
      dictLines.push(remaining);
      arr = line.split('\t');
      dictLines.push({
        word: arr[0],
        pron: phoneticConvert(arr[1]),
        mean: arr[2]
      });
    }
    return console.log('loadDict fin.');
  });
};

loadEdictDict = function() {
  var streamOptions;
  streamOptions = {
    encoding: 'jp-euc'
  };
  return stream = fs.createReadStream("" + __dirname + "/dict/edict2");
};

loadDict = function(dictFileName, encoding) {};

loadYodaoDict();

mainWindow = null;

mainWindowSize = {
  height: 80,
  width: 500
};

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    return app.quit();
  }
});

app.on('ready', function() {
  var showWindowHotkey;
  mainWindow = new BrowserWindow({
    width: mainWindowSize.width,
    height: mainWindowSize.height,
    "always-on-top": true,
    "skip-taskbar": false,
    frame: false
  });
  mainWindow.loadUrl("file://" + __dirname + "/index.html");
  mainWindow.on('closed', function() {
    return mainWindow = null;
  });
  mainWindow.on('blur', function() {
    return setBrowserVisibility(false);
  });
  showWindowHotkey = globalShortcut.register('shift+ctrl+space', function() {
    return setBrowserVisibility(true);
  });
  return mainWindow.openDevTools();
});

setBrowserVisibility = function(visibility) {
  if (visibility) {
    mainWindow.show();
    return app.emit('onBrowserWindowShow');
  } else {
    mainWindow.hide();
    return app.emit('onBrowserWindowHide');
  }
};

app.on('keyup', function(keyword) {
  var ret;
  if (keyword.length !== 0) {
    ret = _.chain(dictLines).filter(function(dict) {
      return dict.word.indexOf(keyword.toLowerCase()) === 0;
    }).first(5).value();
  } else {
    ret = [];
  }
  return app.emit('updateSearchResult', ret);
});

app.on('windowVisible', function(visibility) {
  return setBrowserVisibility(visibility);
});

app.on('windowResultHeight', function(height) {
  height += mainWindowSize.height;
  if (height > 500) {
    height = 500;
  }
  console.log("height: " + height);
  console.log("width: " + mainWindowSize.width);
  return mainWindow.setSize(mainWindowSize.width, height);
});