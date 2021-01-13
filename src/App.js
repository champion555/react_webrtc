import React from 'react';
import './App.css';
import Routes from './Routes';
import {MyApp} from './App.style'

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
      <MyApp className="App">
        <Routes />
      </MyApp>
        

    );
  }
}

export default App;
