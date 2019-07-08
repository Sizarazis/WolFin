import React, { Component } from 'react';

class Stock extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            symbol: this.props.location.pathname,
            response: []
        }
    }

    // Fetch the stock info on first mount
    componentDidMount() {
        this.getStock();
    }

    // Retrieves the stock data from the Express app
    getStock = () => {
        fetch('/api/' + this.state.symbol) 
            .then(res => res.json())
            .then(response => this.setState({ response }), "unfulfilled")
        }

    render() {
        const symbol  = this.state.symbol.substring(1, this.state.symbol.length);
        const response = this.state.response;

        if (response.length == 0) {
            return (
                <div className="App">
                    <h1>{ symbol }</h1>
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            );
        }
        else return (
            <div className="App">
                <h1>{ symbol }</h1>
                <div> 
                    <p>{ JSON.stringify(response) }</p>
                </div>
            </div>
        );
    }
}

export default Stock;