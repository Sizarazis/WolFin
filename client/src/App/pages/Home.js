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
          <br/>
          <br/>
          <p className="warning">Please note: The algorithm used to compute the prediction for the next closing price is solely based
            on the last 10 years of historical closing data. Thus, the algorithm does not take into account
            the vast majority of factors that determine actual stock prices. So, please do not use this tool to 
            advise in your investments.</p>
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