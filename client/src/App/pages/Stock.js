import React, { Component } from 'react';

class Stock extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            symbol: this.props.location.pathname.toUpperCase(),
            response: []
        }
    }

    // Fetch the stock info on first mount
    componentDidMount() {
        this.getStock();
    }

    // Display result content
    displayContent() {
        return (
            // I should display the stock symbol and current price here
            <div class="content">
            </div>
        );
    }

    displayCompanyName() {
        var shortName = this.state.response[0].shortName;
        var longName = this.state.response[0].longName;

        return (
            <div>
                <p> shortName: { shortName } </p>
                <p> longName: { longName } </p>
            </div>
        )
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
        var content = <div></div>;

        // Display loading screen
        if (response.length === 0) {
            content = 
                <div className="loading">
                    <h3>{ symbol }</h3>
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>;
        }
        //TODO: Display error screen
        else if (response[0] == "error") {
            content = 
                <div className="error">
                    <h3>ERROR</h3>
                </div>
        }
        // Display result
        else {
            content = 
                <div>{ this.displayContent() }</div>;
        }
        return (
            <div className="App">
                { content }
            </div>
        );
    }
}

export default Stock;