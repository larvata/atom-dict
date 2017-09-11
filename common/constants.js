const APP_EVENTS = {
  WINDOW_ALL_CLOSED: 'window-all-closed',
  READY: 'ready',
  CHANGE_SEARCH_TERM: 'changeSearchTerm',
  WINDOW_VISIBLE: 'windowVisible',
  WINDOW_RESULT_HEIGHT: 'windowResultHeight',

  // resolve by renderer process
  UPDATE_SEARCH_RESULT: 'updateSearchResult',
  ON_BROWSER_WINDOW_HIDE: 'onBrowserWindowHide',
  ON_BROWSER_WINDOW_SHOW: 'onBrowserWindowShow',
};

const BROWSER_WINDOW_EVENTS = {
  CLOSED: 'closed',
  BLUR: 'blur',
};

const SHOW_WINDOW_HOT_KEY = 'shift+ctrl+space';

const WORD_ENTITY_HEIGHT = 78;
const SEARCH_BOX_HEIGHT = 80;
const UI_MAX_HEIGHT = 500;

module.exports = {
  APP_EVENTS,
  BROWSER_WINDOW_EVENTS,
  SHOW_WINDOW_HOT_KEY,
  WORD_ENTITY_HEIGHT,
  SEARCH_BOX_HEIGHT,
  UI_MAX_HEIGHT,
};
