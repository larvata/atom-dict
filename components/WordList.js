import React, { Component } from 'react';

export class WordList extends Component {

  _renderSearchResults(){
    const {words} = this.props;
    let result  = words.map((word, index)=>{
      return (
        <div className="result" key={index}>
          <div>
            <span className="word">{word.word}</span>
            <span className="pron">{word.pron}</span>
          </div>
          <div className="mean">{word.mean}</div>
          </div>
        );
    });

    return result;
  }

  render() {
    return (
      <div className="result-part">
        {this._renderSearchResults()}
      </div>
    );
  }
}
