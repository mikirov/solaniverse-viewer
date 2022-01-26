import React from 'react';
import ReactDOM from 'react-dom';
import NFTList from './NFTList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NFTList />, div);
  ReactDOM.unmountComponentAtNode(div);
});