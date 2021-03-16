const { ipcRenderer, clipboard } = require('electron');

const React = require('react');
const importJsx = require('import-jsx');

const SearchBox = importJsx('./SearchBox');
const WordList = importJsx('./WordList');
const APP_CONSTANTS = require('../common/constants');

const { Component } = React;
const { APP_EVENTS } = APP_CONSTANTS;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      searchResults: [],
      autoSelect: true,
    };
  }

  componentDidMount() {
    ipcRenderer.on(APP_EVENTS.UPDATE_SEARCH_RESULT, (event, results) => {
      this.setState({
        searchResults: results,
      });
    });

    ipcRenderer.on(APP_EVENTS.ON_BROWSER_WINDOW_HIDE, (event) => {
      this.setState({
        searchTerm: '',
      }, () => {
        ipcRenderer.send(APP_EVENTS.CHANGE_SEARCH_TERM, this.state.searchTerm);
      });
    });

    ipcRenderer.on(APP_EVENTS.ON_BROWSER_WINDOW_SHOW, () => {
      const word = clipboard.readText('string').trim();
      if (/^\w+$/.test(word)) {
        this._retrieveSearchResults(word, true);
      }
      else {
        this.setState({
          autoSelect: false,
        });
      }
    });
  }

  searchTermChangeHandler(event) {
    const { value } = event.target;
    this._retrieveSearchResults(value, false);
  }

  _retrieveSearchResults(value, autoSelect) {
    this.setState({ searchTerm: value, autoSelect }, () => {
      ipcRenderer.send(APP_EVENTS.CHANGE_SEARCH_TERM, value);
    });
  }

  _appKeyUpHandler(event) {
    const keyCode = event.keyCode;
    if (keyCode === 27) {
      // escape: close window
      ipcRenderer.send(APP_EVENTS.WINDOW_VISIBLE, false);
    }
  }

  render() {
    const { searchTerm, searchResults, autoSelect } = this.state;
    return (
      <div onKeyUp={this._appKeyUpHandler}>
        <SearchBox onChange={this.searchTermChangeHandler.bind(this)} value={searchTerm} autoSelect={autoSelect} />
        <WordList words={searchResults} />
      </div>
    );
  }
}

module.exports = App;
