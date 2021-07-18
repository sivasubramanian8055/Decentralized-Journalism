import React, { Component } from 'react';

import RootRouter from './RootRouter';
import "../styles/App.css"
import '../styles/style.scss';

class App extends Component {
  render() {
    return (
      <div>
        <RootRouter />
      </div>
    );
  }
}

export default App;
