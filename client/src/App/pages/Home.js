import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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

    displayContent() {
      return (
        <span>
          <br/>
          <p className="Instructions">Enter a symbol traded on the NYSE.</p>
            {/* Input field for stock symbols */}
          <input className="symbolInputBox" type="text" placeholder="e.g. MSFT" onChange={this.handleChange}></input>
            {/* Link to List.js */}
          <Link to={'./predictor/' + this.state.symbol}><button className="symbolButton"><span className="symbolInputText">Go</span></button></Link>
        </span>
      );
    }

    render() {
      return (
        <div className="Home">
            { this.displayContent() }
        </div>
    );
  }
}

export default Home;