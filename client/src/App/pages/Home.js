import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import App from '../App.js';


class Home extends Component {
    constructor(props) {
        super(props);
    
      this.state = {
        symbol: "NULL"
      };
    
      this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e) {
      this.setState({
        symbol: e.target.value
      });
    }

    //TODO: displays content
    displayContent() {
      return (
        <div>
          <h5>Enter a symbol traded on the NYSE.</h5>
            {/* Input field for stock symbols */}
          <input type="text" placeholder="e.g. MSFT" onChange={this.handleChange}></input>
            {/* Link to List.js */}
          <Link to={'./' + this.state.symbol}><button variant="raised">Go</button></Link>
        </div>
      );
    }

    render() {
      var content = <div> { this.displayContent() } </div>;

      return (
        <div className="App">
            { content }
        </div>
    );
  }
}

export default Home;