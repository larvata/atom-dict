const APP_EVENTS = {
  WINDOW_ALL_CLOSED: 'window-all-closed',
  READY: 'ready',
  CHANGE_SEARCH_TERM: 'changeSearchTerm',
  WINDOW_VISIBLE: 'windowVisible',
  SET_ENTRY_HEIGHT: 'setEntryHeight',

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

const UI_ENTRY_MAX_HEIGHT = 500;

module.exports = {
  APP_EVENTS,
  BROWSER_WINDOW_EVENTS,
  SHOW_WINDOW_HOT_KEY,
  UI_ENTRY_MAX_HEIGHT,
};
