const React = require('react');

const { Component } = React;

class WordList extends Component {
  _renderSearchResults() {
    const { words } = this.props;
    const result = words.map((word, index) => {
      return (
        <div className="result" key={index}>
          <div>
            <span className="word">{word.word}</span>
            <span className="pron">{word.pron}</span>
          </div>
          <div className="mean">{word.mean}</div>
        </div>);
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

module.exports = WordList;
