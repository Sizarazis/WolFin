import React, { Component } from 'react';

class Stock extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            symbol: this.props.location.pathname.toUpperCase().substring(11),
            response: []
        }

        this.displayContent = this.displayContent.bind(this);
    }

    // Fetch the stock info on first mount
    componentDidMount() {
        this.getStock();
    }

    // Display result content
    displayContent() {
        var lastEntry = this.state.response[1].body.chart.result[0].indicators.adjclose[0].adjclose.length - 1;
        var previousAdjClose = this.state.response[1].body.chart.result[0].indicators.adjclose[0].adjclose[lastEntry];

        return (
            // I should display the stock symbol and current price here
            <div class="content">
                <h3>{ this.state.symbol }</h3>
                <p>Today's Adjusted Close: { previousAdjClose } </p>
                <p>Tomorrow's Predicted Adjusted Close: { this.state.response[2] }</p>
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
        fetch('/api/predictor/' + this.state.symbol) 
            .then(res => res.json())
            .then(response => this.setState({ response }), "unfulfilled")
        }

    render() {
        const symbol  = this.state.symbol;
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
        else if (response[0] === "error") {
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