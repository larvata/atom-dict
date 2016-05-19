import React, {Component} from 'react';
import {SearchBox} from './SearchBox';
import {WordList} from './WordList';
import {APP_EVENTS} from '../common/const';

import {remote, clipboard}  from 'electron';
const {app} = remote;

export class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      searchTerm: '',
      searchResults: [],
      autoSelect: true
    };
  }

  componentDidMount(){
    app.on(APP_EVENTS.UPDATE_SEARCH_RESULT, results=>{
      this.setState({
        searchResults: results
      });
    });

    app.on(APP_EVENTS.ON_BROWSER_WINDOW_HIDE, ()=>{
      this.setState({
        searchTerm: ''
      });
    });

    app.on(APP_EVENTS.ON_BROWSER_WINDOW_SHOW, ()=>{
      let word = clipboard.readText('string').trim();
      if (/^\w+$/.test(word)) {
        this._retrieveSearchResults(word, true);
      }
      else{
        this.setState({
          autoSelect: false
        });
      }
    });
  }

  searchTermChangeHandler(event){
    let value = event.target.value;
    this._retrieveSearchResults(value, false);
  }

  _retrieveSearchResults(value, autoSelect){
    this.setState({searchTerm: value, autoSelect}, ()=>{
      app.emit(APP_EVENTS.CHANGE_SEARCH_TERM, value);
    });
  }

  _appKeyUpHandler(event){
    let keyCode = event.keyCode;
    if (keyCode === 27) {
      // escape: close window
      app.emit(APP_EVENTS.WINDOW_VISIBLE, false);
    }
  }

  render() {
    const {searchTerm, searchResults, autoSelect} = this.state;
    return (
      <div onKeyUp={this._appKeyUpHandler}>
        <SearchBox onChange={this.searchTermChangeHandler.bind(this)} value={searchTerm} autoSelect={autoSelect} />
        <WordList words={searchResults} />
      </div>
    );
  }
}
