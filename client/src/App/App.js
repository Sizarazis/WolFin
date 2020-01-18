// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Stock from './pages/Stock';

class App extends Component {

  //TODO
  displayHeader() {
    return (
        <div class="header">
            <h1>WolFin</h1>
            <p>A simple stock predictor.</p>
        </div>
    );
  }

  //TODO
  displayMenuBar() {
      return (
          <div className="menubar">
          </div>
      );
  }

  //TODO
  displayFooter() {
      return (
          <div className="footer">
          </div>
      );
  }

  render() {
    const App = () => (
      <div>
        <div> { this.displayHeader() } </div>
        <div> { this.displayMenuBar() } </div>
        <div> { this.displayFooter() } </div>
        <style>{'body { background-color: #fbfbfb; }'}</style>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/*' component={Stock}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;