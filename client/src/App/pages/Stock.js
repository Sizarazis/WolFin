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
        var upTick = this.state.response[2] >= previousAdjClose;

        var content = <div></div>;
        
        if (upTick) {
            content = 
            <div className="Stock">
                <h3>{ this.state.response[0].longName } ({ this.state.symbol })</h3>
                <div className="delineator"></div>
                <br/>
                <table className="predictionTable">
                    <tr>
                        <td><span><p>LAST CLOSE (USD)</p></span></td>
                        <td><span><p>PREDICTED CLOSE (USD)</p></span></td>
                    </tr>
                    <tr>
                        <td className="lastClose">{ Math.round(previousAdjClose * 100)/100 }</td>
                        <td className="upPrediction">{ Math.round(this.state.response[2] * 100)/100 }</td>
                    </tr>
                </table>
            </div>;
        }
        else {
            content = 
            <div className="Stock">
                <h3>{ this.state.response[0].longName } ({ this.state.symbol })</h3>
                <div className="delineator"></div>
                <br/>
                <table className="predictionTable">
                    <tr>
                        <td><span><p>LAST CLOSE (USD)</p></span></td>
                        <td><span><p>PREDICTED CLOSE (USD)</p></span></td>
                    </tr>
                    <tr>
                        <td className="lastClose">{ Math.round(previousAdjClose * 100)/100 }</td>
                        <td className="downPrediction">{ Math.round(this.state.response[2] * 100)/100 }</td>
                    </tr>
                </table>
            </div>
        }

        return content;
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
                    <p>Querying { symbol }</p>
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
            <div>
                <br/>
                { content }
            </div>
        );
    }
}

export default Stock;