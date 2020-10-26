import React from 'react';
import './App.css';
import Routes from './Routes';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      component: 'record',
      result: null,
    }
  }

  render() {
    const { component, result } = this.state;

    return (
      <div className="App">
        <Routes />
      </div>
        

    );
  }
}

export default App;
