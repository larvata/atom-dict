const React = require('react');
const ReactDOM = require('react-dom');
const importJsx = require('import-jsx');

const App = importJsx('./components/App');

window.onload = () => {
  ReactDOM.render(
    React.createElement(App),
    document.getElementById('root'));
};
