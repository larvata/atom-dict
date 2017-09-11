const React = require('react');

const { Component } = React;

class SearchBox extends Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  componentDidUpdate() {
    const { autoSelect } = this.props;

    if (autoSelect) {
      this.refs.input.select();
    }
  }

  render() {
    const { value, onChange } = this.props;
    return (
      <div className="search-part">
        <input ref="input" type="text" className="search-box" onChange={onChange} value={value} />
      </div>
    );
  }
}

module.exports = SearchBox;
