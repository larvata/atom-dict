// const ReactDOM = require('react-dom');
import ReactDOM from 'react-dom';
import React from 'react';
import {App} from './components/App';

window.onload = ()=>{
  ReactDOM.render(<App />, document.getElementById('root'));
};
