import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Stock from './pages/Stock';
import About from './pages/About';

class App extends Component {

  displayHeader() {
    return (
        <span>
            <h1>WolFin</h1>
            <p>A simple stock predictor.</p>
        </span>
    );
  }

  displayMenuBar() {
    var split = window.location.href.split('/');
    var route = '/' + split[split.length-1];
    var menubar;

    switch(route) {
      case '/':
        menubar = 
        <table>
          <tbody>
            <tr>
              <td><Link className="currentLink" to={'../'}>Home</Link></td>
              <td><Link to={'../about'}>About</Link></td>
            </tr>
          </tbody>
        </table>
        break;
      case '/about':
        menubar = 
        <table>
          <tbody>
            <tr>
              <td><Link to={'../'}>Home</Link></td>
              <td><Link className="currentLink" to={'../about'}>About</Link></td>
            </tr>
          </tbody>
        </table>
        break;
      default:
        menubar = 
        <table>
          <tbody>
            <tr>
              <td><Link to={'../'}>Home</Link></td>
              <td><Link to={'../about'}>About</Link></td>
            </tr>
          </tbody>
        </table>
        break;
    }

    return (
        <span>
          <div className="delineator"></div>
          { menubar }
        </span>
    );
  }

  displayFooter() {
      return (
          <span>
            <div className="delineator"></div>
            <div className="text">
              <p>Contact: srazis@yahoo.com</p>
              <p>Development: github.com/Sizarazis/WolFin</p>
            </div>
          </span>
      );
  }

  render() {
    const App = () => (
      <div className="App">
        <div className="header"> { this.displayHeader() } </div>
        <div className="menubar"> { this.displayMenuBar() } </div>
        <style>{'body { background-color: #414141; }'}</style>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/about' component={About}/>
          <Route exact path='/predictor/*' component={Stock}/>
        </Switch>
        <div className="footer"> { this.displayFooter() } </div>
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