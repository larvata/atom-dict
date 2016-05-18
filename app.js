const electron = require('electron');

const {remote, clipboard} = electron;
const {app} = remote;

const _ = remote.require('./node_modules/underscore/underscore-min.js');
const searchBox = document.querySelector('.search-box');

document.addEventListener('keyup', e=>{
  if (e.keyCode === 27) {
    searchBox.focus();
    app.emit('updateSearchResult', []);
    app.emit('windowVisible', false);
  }
});

searchBox.addEventListener('keyup', function(e){
  app.emit('keyup', this.value);
});

app.on('updateSearchResult', results=>{
  let tpl = document.querySelector('#resultTpl').innerHTML;
  let compiled = _.template(tpl);
  let html = compiled({results: results});

  document.querySelector('.result-part').innerHTML = html;

  let resultHeight = 78*results.length;

  if (resultHeight>350) {
    document.querySelector('.result-part').height(350);
  }

  app.emit('windowResultHeight', resultHeight + 80);
});

app.on('onBrowserWindowHide', ()=>{
  searchBox.value = '';
});

app.on('onBrowserWindowShow', ()=>{
  searchBox.focus();
  let word = clipboard.readText('string').trim();
  if (/^\w+$/.test(word)) {
    searchBox.value = word;
    app.emit('keyup', word);
    searchBox.select();
  }
});