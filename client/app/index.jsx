import React from 'react';
import ReactDOM from 'react-dom';
import Tabs from './components/Tabs.jsx';

class Main extends React.Component {
  render() {
    return <Tabs />
  }
}

ReactDOM.render(<Main />, document.getElementById('main'));
