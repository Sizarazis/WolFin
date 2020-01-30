import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Stock from './pages/Stock';
import About from './pages/About';

class App extends Component {

  //TODO
  displayHeader() {
    return (
        <div className="header">
          <div className="header-icon-image">
            <h1>WolFin</h1>
            <p>A simple stock predictor.</p>
          </div>
        </div>
    );
  }

  //TODO
  displayMenuBar() {
      return (
          <div className="menubar">
            <table>
              <tr>
                <td><Link to={'../'}>Home</Link></td>
                <td><Link to={'../About'}>About</Link></td>
              </tr>
            </table>
          </div>
      );
  }

  //TODO
  displayFooter() {
      return (
          <div className="footer">
            <div className="topBorder"></div>
            <p>Contact: srazis@yahoo.com</p>
            <p>Development: github.com/Sizarazis/WolFin</p>
          </div>
      );
  }

  render() {
    const App = () => (
      <div>
        <div> { this.displayHeader() } </div>
        <div> { this.displayMenuBar() } </div>
        <div> { this.displayFooter() } </div>
        <br/>
        <style>{'body { background-color: #f5f9ff; }'}</style>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/About' component={About}/>
          <Route exact path='/predictor/*' component={Stock}/>
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