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

    render() {
      var header = <div class="header">
                    <h1>WolFin</h1>
                    <p>A simple stock predictor using AWS machine learning tools.</p>
                  </div>;
      var footer = <div class="footer1"><br/></div>;

        return (
        <div className="App">
            { header }
            <h5>Enter a symbol traded on the NYSE.</h5>
            {/* Input field for stock symbols */}
            <input type="text" placeholder="e.g. MSFT" onChange={this.handleChange}>
            </input>
            {/* Link to List.js */}
            <Link to={'./' + this.state.symbol}>
                <button variant="raised">
                    Go
                </button>
            </Link>
            { footer }
        </div>
    );
    }
}
export default Home;

// TO DO:
// - When the user presses 'Go' the thing in the text field should be sent to the 
//   server
// - The text field needs to be checked for malicious stuff
// - The server will check if it's a valid stock symbol and make a call to the Yahoo
//   Finance API, getting info on that stock.
// - Do I need to add the symbol to a queue on the server if it's busy?

// - The client will have a loading div until the server responds, or if it times out.
// - If the symbol is invalid, have a message and a button to go back
// - When the server responds it will display the data corresponding to the symbol
// - It will also apply a next day up or down guess, using AWS machine learning